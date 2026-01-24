import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import Modal from "../commonComponents/Modal";

import { Document, DocumentType } from "./types";
import {
  formatFileSize,
  formatDate,
  getDocumentTypeLabel,
  getAccessLevelLabel,
  mockAuditLog,
} from "./mockData";
import icons from "./icons";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
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

const getAuditActionIcon = (action: string): IconProp => {
  const iconMap: Record<string, IconProp> = {
    VIEW: icons.eye,
    DOWNLOAD: icons.download,
    UPLOAD: icons.upload,
    EDIT: icons.edit,
    DELETE: icons.trashAlt,
    PERMISSION_GRANTED: icons.userPlus,
    PERMISSION_REVOKED: icons.userMinus,
    MOVED: icons.arrowsAlt,
    RENAMED: icons.iCursor,
  };
  return iconMap[action] || icons.history;
};

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onManagePermissions,
}) => {
  if (!document) return null;

  const documentAuditLog = mockAuditLog.filter(
    (entry) => entry.documentId === document.id
  );

  return (
    <Modal
      showModal={isOpen}
      onClose={onClose}
      contentLabel={`View document: ${document.name}`}
    >
      <div style={{ maxWidth: "800px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#d9e8f6",
              borderRadius: "8px",
              color: "#1a4480",
              fontSize: "1.75rem",
              flexShrink: 0,
            }}
          >
            <FontAwesomeIcon icon={getDocumentIcon(document.type)} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: "1.25rem",
                wordBreak: "break-word",
              }}
            >
              {document.name}
              {document.isConfidential && (
                <FontAwesomeIcon
                  icon={icons.lock}
                  style={{
                    marginLeft: "8px",
                    color: "#b50909",
                    fontSize: "1rem",
                  }}
                  title="Confidential"
                />
              )}
            </h2>
            <p style={{ margin: 0, color: "#71767a" }}>
              {getDocumentTypeLabel(document.type)} - Version {document.version}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              className="usa-button usa-button--outline"
              onClick={() => onDownload(document)}
            >
              <FontAwesomeIcon
                icon={icons.download}
                style={{ marginRight: "8px" }}
              />
              Download
            </button>
            <button
              className="usa-button usa-button--outline"
              onClick={() => onManagePermissions(document)}
            >
              <FontAwesomeIcon
                icon={icons.usersCog}
                style={{ marginRight: "8px" }}
              />
              Permissions
            </button>
          </div>
        </div>

        {document.description && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          >
            <h4 style={{ margin: "0 0 8px", fontSize: "14px" }}>Description</h4>
            <p style={{ margin: 0, color: "#5c5c5c" }}>
              {document.description}
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#71767a",
                marginBottom: "4px",
              }}
            >
              File Size
            </div>
            <div style={{ fontWeight: 600 }}>
              {formatFileSize(document.size)}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#71767a",
                marginBottom: "4px",
              }}
            >
              Uploaded
            </div>
            <div style={{ fontWeight: 600 }}>
              {formatDate(document.uploadedAt)}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#71767a",
                marginBottom: "4px",
              }}
            >
              Uploaded By
            </div>
            <div style={{ fontWeight: 600 }}>{document.uploadedBy}</div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#71767a",
                marginBottom: "4px",
              }}
            >
              Access
            </div>
            <div style={{ fontWeight: 600 }}>
              {document.permissions.length} user
              {document.permissions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {document.tags.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>Tags</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="usa-tag"
                  style={{ backgroundColor: "#e1e7f1", color: "#1a4480" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>
            <FontAwesomeIcon
              icon={icons.users}
              style={{ marginRight: "8px" }}
            />
            Access Permissions
          </h4>
          <div
            style={{
              border: "1px solid #dfe1e2",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Access Level
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Granted
                  </th>
                </tr>
              </thead>
              <tbody>
                {document.permissions.map((permission) => (
                  <tr
                    key={permission.id}
                    style={{ borderTop: "1px solid #dfe1e2" }}
                  >
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 600 }}>
                        {permission.userName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#71767a" }}>
                        {permission.userEmail}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        className="usa-tag"
                        style={{
                          backgroundColor:
                            permission.accessLevel === "OWNER"
                              ? "#1a4480"
                              : "#e1e7f1",
                          color:
                            permission.accessLevel === "OWNER"
                              ? "white"
                              : "#1a4480",
                        }}
                      >
                        {getAccessLevelLabel(permission.accessLevel)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: "14px",
                        color: "#5c5c5c",
                      }}
                    >
                      {formatDate(permission.grantedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {documentAuditLog.length > 0 && (
          <div>
            <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>
              <FontAwesomeIcon
                icon={icons.history}
                style={{ marginRight: "8px" }}
              />
              Activity Log
            </h4>
            <div
              style={{
                border: "1px solid #dfe1e2",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {documentAuditLog.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #dfe1e2",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={getAuditActionIcon(entry.action)}
                    style={{ color: "#71767a" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px" }}>{entry.details}</div>
                    <div style={{ fontSize: "12px", color: "#71767a" }}>
                      {entry.performedBy} - {formatDate(entry.performedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #dfe1e2",
          }}
        >
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewer;
