import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Dropdown from "../commonComponents/Dropdown";
import TextInput from "../commonComponents/TextInput";

import {
  Document,
  DocumentType,
  DocumentFilter,
  SortConfig,
  PaginationConfig,
} from "./types";
import { mockDocuments, getDocumentTypeLabel } from "./mockData";
import DocumentCard from "./DocumentCard";
import DocumentTable from "./DocumentTable";
import icons from "./icons";

interface DocumentListProps {
  selectedAccountId: string | null;
  selectedFolderId: string | null;
  onViewDocument: (document: Document) => void;
  onDownloadDocument: (document: Document) => void;
  onManagePermissions: (document: Document) => void;
}

type ViewMode = "grid" | "table";

export const DocumentList: React.FC<DocumentListProps> = ({
  selectedAccountId,
  selectedFolderId,
  onViewDocument,
  onDownloadDocument,
  onManagePermissions,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<DocumentFilter>({
    searchTerm: "",
    documentType: undefined,
    isConfidential: undefined,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "uploadedAt",
    direction: "desc",
  });
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 0,
  });

  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...mockDocuments];

    if (selectedAccountId) {
      result = result.filter((doc) => doc.accountId === selectedAccountId);
    }

    if (selectedFolderId !== undefined) {
      result = result.filter((doc) => doc.folderId === selectedFolderId);
    }

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filter.documentType) {
      result = result.filter((doc) => doc.type === filter.documentType);
    }

    if (filter.isConfidential !== undefined) {
      result = result.filter(
        (doc) => doc.isConfidential === filter.isConfidential
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "uploadedAt":
          comparison =
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [selectedAccountId, selectedFolderId, filter, sortConfig]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredAndSortedDocuments.slice(startIndex, endIndex);
  }, [filteredAndSortedDocuments, pagination.page, pagination.pageSize]);

  const totalPages = Math.ceil(
    filteredAndSortedDocuments.length / pagination.pageSize
  );

  const handleSort = (field: SortConfig["field"]) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const documentTypeOptions = [
    { value: "", label: "All Types" },
    ...Object.values(DocumentType).map((type) => ({
      value: type,
      label: getDocumentTypeLabel(type),
    })),
  ];

  const confidentialOptions = [
    { value: "", label: "All Documents" },
    { value: "true", label: "Confidential Only" },
    { value: "false", label: "Non-Confidential Only" },
  ];

  return (
    <div className="document-list">
      <div className="document-storage__filters">
        <div className="document-storage__filter-row">
          <div className="document-storage__filter-group document-storage__search-input">
            <label htmlFor="search-documents">Search</label>
            <div style={{ position: "relative" }}>
              <FontAwesomeIcon
                icon={icons.search}
                className="search-icon"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#71767a",
                }}
              />
              <TextInput
                name="search-documents"
                idString="search-documents"
                value={filter.searchTerm || ""}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
                }
                placeholder="Search by name, description, or tags..."
                style={{ paddingLeft: "40px" }}
              />
            </div>
          </div>
          <div className="document-storage__filter-group">
            <label htmlFor="filter-type">Document Type</label>
            <Dropdown
              id="filter-type"
              selectedValue={filter.documentType || ""}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  documentType: e.target.value
                    ? (e.target.value as DocumentType)
                    : undefined,
                }))
              }
              options={documentTypeOptions}
              ariaLabel="Filter by document type"
            />
          </div>
          <div className="document-storage__filter-group">
            <label htmlFor="filter-confidential">Confidentiality</label>
            <Dropdown
              id="filter-confidential"
              selectedValue={
                filter.isConfidential === undefined
                  ? ""
                  : filter.isConfidential.toString()
              }
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  isConfidential:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                }))
              }
              options={confidentialOptions}
              ariaLabel="Filter by confidentiality"
            />
          </div>
        </div>
      </div>

      <div className="document-list__header">
        <div>
          <h2>Documents</h2>
          <span className="document-list__count">
            {filteredAndSortedDocuments.length} document
            {filteredAndSortedDocuments.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="document-list__view-toggle">
          <button
            className={
              viewMode === "grid" ? "document-list__view-toggle--active" : ""
            }
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <FontAwesomeIcon icon={icons.thLarge} />
          </button>
          <button
            className={
              viewMode === "table" ? "document-list__view-toggle--active" : ""
            }
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            aria-pressed={viewMode === "table"}
          >
            <FontAwesomeIcon icon={icons.list} />
          </button>
        </div>
      </div>

      {paginatedDocuments.length === 0 ? (
        <div className="document-list__empty">
          <FontAwesomeIcon icon={icons.folderOpen} className="empty-icon" />
          <h3>No documents found</h3>
          <p>
            {filter.searchTerm || filter.documentType
              ? "Try adjusting your filters or search term."
              : "Upload your first document to get started."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="document-list__grid">
          {paginatedDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onViewDocument}
              onDownload={onDownloadDocument}
              onManagePermissions={onManagePermissions}
            />
          ))}
        </div>
      ) : (
        <DocumentTable
          documents={paginatedDocuments}
          sortConfig={sortConfig}
          onSort={handleSort}
          onView={onViewDocument}
          onDownload={onDownloadDocument}
          onManagePermissions={onManagePermissions}
        />
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__button"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page === 1}
            aria-label="First page"
          >
            <FontAwesomeIcon icon={icons.angleDoubleLeft} />
          </button>
          <button
            className="pagination__button"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={icons.angleLeft} />
          </button>
          <span className="pagination__info">
            Page {pagination.page} of {totalPages}
          </span>
          <button
            className="pagination__button"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={icons.angleRight} />
          </button>
          <button
            className="pagination__button"
            onClick={() => handlePageChange(totalPages)}
            disabled={pagination.page === totalPages}
            aria-label="Last page"
          >
            <FontAwesomeIcon icon={icons.angleDoubleRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
