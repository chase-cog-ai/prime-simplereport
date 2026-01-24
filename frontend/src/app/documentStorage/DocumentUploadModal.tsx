import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "../commonComponents/Modal";
import Dropdown from "../commonComponents/Dropdown";
import TextInput from "../commonComponents/TextInput";

import { DocumentType } from "./types";
import { mockFolders, formatFileSize, getDocumentTypeLabel } from "./mockData";
import icons from "./icons";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], metadata: UploadMetadata) => void;
  selectedAccountId: string | null;
}

interface UploadMetadata {
  folderId: string | null;
  documentType: DocumentType;
  description: string;
  tags: string[];
  isConfidential: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  selectedAccountId,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    folderId: null,
    documentType: DocumentType.OTHER,
    description: "",
    tags: [],
    isConfidential: false,
  });
  const [tagInput, setTagInput] = useState("");

  const availableFolders = selectedAccountId
    ? mockFolders.filter((f) => f.accountId === selectedAccountId)
    : mockFolders;

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onUpload(files, metadata);
      handleClose();
    }
  };

  const handleClose = () => {
    setFiles([]);
    setMetadata({
      folderId: null,
      documentType: DocumentType.OTHER,
      description: "",
      tags: [],
      isConfidential: false,
    });
    setTagInput("");
    onClose();
  };

  const documentTypeOptions = Object.values(DocumentType).map((type) => ({
    value: type,
    label: getDocumentTypeLabel(type),
  }));

  const folderOptions: { value: string; label: string }[] = [
    { value: "", label: "Root (No Folder)" },
    ...availableFolders.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })),
  ];

  return (
    <Modal
      showModal={isOpen}
      onClose={handleClose}
      contentLabel="Upload Documents"
    >
      <div className="upload-modal">
        <h2>Upload Documents</h2>

        <div
          className={`upload-modal__dropzone ${
            isDragging ? "upload-modal__dropzone--active" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              document.getElementById("file-input")?.click();
            }
          }}
          aria-label="Drop files here or click to select"
        >
          <FontAwesomeIcon
            icon={icons.cloudUploadAlt}
            className="upload-icon"
          />
          <h3>Drag and drop files here</h3>
          <p>or click to select files from your computer</p>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
          />
        </div>

        {files.length > 0 && (
          <div className="upload-modal__file-list">
            <h4>Selected Files ({files.length})</h4>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="upload-modal__file-item"
              >
                <FontAwesomeIcon icon={icons.file} className="file-icon" />
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <FontAwesomeIcon icon={icons.times} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="upload-modal__form-group">
          <label htmlFor="folder-select">Destination Folder</label>
          <Dropdown
            id="folder-select"
            selectedValue={metadata.folderId || ""}
            onChange={(e) =>
              setMetadata((prev) => ({
                ...prev,
                folderId: e.target.value || null,
              }))
            }
            options={folderOptions}
            ariaLabel="Select destination folder"
          />
        </div>

        <div className="upload-modal__form-group">
          <label htmlFor="document-type-select">Document Type</label>
          <Dropdown
            id="document-type-select"
            selectedValue={metadata.documentType}
            onChange={(e) =>
              setMetadata((prev) => ({
                ...prev,
                documentType: e.target.value as DocumentType,
              }))
            }
            options={documentTypeOptions}
            ariaLabel="Select document type"
          />
        </div>

        <div className="upload-modal__form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            className="usa-textarea"
            value={metadata.description}
            onChange={(e) =>
              setMetadata((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter a description for the document(s)"
          />
        </div>

        <div className="upload-modal__form-group">
          <label htmlFor="tags">Tags</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <TextInput
              name="tags"
              idString="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>
          {metadata.tags.length > 0 && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="usa-tag"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0 2px",
                      color: "inherit",
                    }}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <FontAwesomeIcon icon={icons.times} size="xs" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="upload-modal__form-group">
          <div className="upload-modal__checkbox">
            <input
              type="checkbox"
              id="confidential"
              className="usa-checkbox__input"
              checked={metadata.isConfidential}
              onChange={(e) =>
                setMetadata((prev) => ({
                  ...prev,
                  isConfidential: e.target.checked,
                }))
              }
            />
            <label className="usa-checkbox__label" htmlFor="confidential">
              <FontAwesomeIcon
                icon={icons.lock}
                style={{ marginRight: "8px" }}
              />
              Mark as Confidential
            </label>
          </div>
        </div>

        <div className="upload-modal__actions">
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="usa-button"
            onClick={handleSubmit}
            disabled={files.length === 0}
          >
            <FontAwesomeIcon
              icon={icons.upload}
              style={{ marginRight: "8px" }}
            />
            Upload{" "}
            {files.length > 0
              ? `(${files.length} file${files.length > 1 ? "s" : ""})`
              : ""}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
