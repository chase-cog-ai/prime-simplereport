import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { Document, DocumentType } from "./types";
import { formatFileSize, formatDate, getDocumentTypeLabel } from "./mockData";
import icons from "./icons";

interface DocumentCardProps {
  document: Document;
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

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onManagePermissions,
}) => {
  return (
    <div
      className="document-card"
      onClick={() => onView(document)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onView(document);
        }
      }}
      aria-label={`View document: ${document.name}`}
    >
      <div className="document-card__header">
        <div className="document-card__icon">
          <FontAwesomeIcon icon={getDocumentIcon(document.type) as any} />
        </div>
        <div className="document-card__title">
          <h4 title={document.name}>{document.name}</h4>
          <div className="document-type">
            {getDocumentTypeLabel(document.type)}
          </div>
        </div>
        {document.isConfidential && (
          <div className="document-card__confidential" title="Confidential">
            <FontAwesomeIcon icon={icons.lock} />
          </div>
        )}
      </div>

      <div className="document-card__meta">
        <span>
          <FontAwesomeIcon icon={icons.hdd} />
          {formatFileSize(document.size)}
        </span>
        <span>
          <FontAwesomeIcon icon={icons.calendar} />
          {formatDate(document.uploadedAt)}
        </span>
        <span>
          <FontAwesomeIcon icon={icons.codeBranch} />v{document.version}
        </span>
      </div>

      {document.tags.length > 0 && (
        <div className="document-card__tags">
          {document.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="document-card__tag">
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="document-card__tag">
              +{document.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="document-card__actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(document);
          }}
          aria-label={`View ${document.name}`}
        >
          <FontAwesomeIcon icon={icons.eye} /> View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(document);
          }}
          aria-label={`Download ${document.name}`}
        >
          <FontAwesomeIcon icon={icons.download} /> Download
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onManagePermissions(document);
          }}
          aria-label={`Manage permissions for ${document.name}`}
        >
          <FontAwesomeIcon icon={icons.usersCog} /> Permissions
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
