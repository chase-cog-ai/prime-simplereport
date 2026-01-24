import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { Document, DocumentType, SortConfig } from "./types";
import { formatFileSize, formatDate, getDocumentTypeLabel } from "./mockData";
import icons from "./icons";

interface DocumentTableProps {
  documents: Document[];
  sortConfig: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
  onView: (document: Document) => void;
  onDownload: (document: Document) => void;
  onManagePermissions: (document: Document) => void;
}

const getDocumentIcon = (type: DocumentType): IconProp => {
  const iconMap: Record<DocumentType, IconProp> = {
    [DocumentType.CONTRACT]: icons.fileContract,
    [DocumentType.AGREEMENT]: icons.fileSignature,
    [DocumentType.BRIEF]: icons.fileAlt,
    [DocumentType.MOTION]: icons.gavel,
    [DocumentType.PLEADING]: icons.fileAlt,
    [DocumentType.CORRESPONDENCE]: icons.envelope,
    [DocumentType.EVIDENCE]: icons.fileImage,
    [DocumentType.DISCOVERY]: icons.search,
    [DocumentType.COURT_FILING]: icons.balanceScale,
    [DocumentType.MEMO]: icons.stickyNote,
    [DocumentType.OTHER]: icons.file,
  };
  return iconMap[type] || icons.file;
};

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  sortConfig,
  onSort,
  onView,
  onDownload,
  onManagePermissions,
}) => {
  const getSortIcon = (field: SortConfig["field"]): IconProp => {
    if (sortConfig.field !== field) {
      return icons.sort;
    }
    return sortConfig.direction === "asc" ? icons.sortUp : icons.sortDown;
  };

  return (
    <div className="document-list__table">
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => onSort("name")} aria-label="Sort by name">
                Name <FontAwesomeIcon icon={getSortIcon("name")} />
              </button>
            </th>
            <th>
              <button onClick={() => onSort("type")} aria-label="Sort by type">
                Type <FontAwesomeIcon icon={getSortIcon("type")} />
              </button>
            </th>
            <th>
              <button onClick={() => onSort("size")} aria-label="Sort by size">
                Size <FontAwesomeIcon icon={getSortIcon("size")} />
              </button>
            </th>
            <th>
              <button
                onClick={() => onSort("uploadedAt")}
                aria-label="Sort by date"
              >
                Uploaded <FontAwesomeIcon icon={getSortIcon("uploadedAt")} />
              </button>
            </th>
            <th>Uploaded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                <div className="document-row__name">
                  <FontAwesomeIcon
                    icon={getDocumentIcon(document.type)}
                    className="file-icon"
                  />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onView(document);
                    }}
                  >
                    {document.name}
                  </a>
                  {document.isConfidential && (
                    <FontAwesomeIcon
                      icon={icons.lock}
                      className="document-row__confidential"
                      title="Confidential"
                    />
                  )}
                </div>
              </td>
              <td>
                <span className="document-row__type">
                  {getDocumentTypeLabel(document.type)}
                </span>
              </td>
              <td>{formatFileSize(document.size)}</td>
              <td>{formatDate(document.uploadedAt)}</td>
              <td>{document.uploadedBy}</td>
              <td>
                <div className="document-row__actions">
                  <button
                    onClick={() => onView(document)}
                    title="View document"
                    aria-label={`View ${document.name}`}
                  >
                    <FontAwesomeIcon icon={icons.eye} />
                  </button>
                  <button
                    onClick={() => onDownload(document)}
                    title="Download document"
                    aria-label={`Download ${document.name}`}
                  >
                    <FontAwesomeIcon icon={icons.download} />
                  </button>
                  <button
                    onClick={() => onManagePermissions(document)}
                    title="Manage permissions"
                    aria-label={`Manage permissions for ${document.name}`}
                  >
                    <FontAwesomeIcon icon={icons.usersCog} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
