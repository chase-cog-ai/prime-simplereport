import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Document, AccessLevel } from "./types";
import { mockDocuments } from "./mockData";
import AccountSelector from "./AccountSelector";
import FolderTree from "./FolderTree";
import DocumentList from "./DocumentList";
import DocumentUploadModal from "./DocumentUploadModal";
import PermissionsModal from "./PermissionsModal";
import DocumentViewer from "./DocumentViewer";
import icons from "./icons";
import "./DocumentStorage.scss";

export const DocumentStorageApp: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const [_documents, setDocuments] = useState<Document[]>(mockDocuments);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleDownloadDocument = (document: Document) => {
    console.log("Downloading document:", document.name);
    alert(`Download started for: ${document.name}`);
  };

  const handleManagePermissions = (document: Document) => {
    setSelectedDocument(document);
    setIsPermissionsModalOpen(true);
  };

  const handleUpload = (
    files: File[],
    metadata: {
      folderId: string | null;
      documentType: string;
      description: string;
      tags: string[];
      isConfidential: boolean;
    }
  ) => {
    console.log("Uploading files:", files, "with metadata:", metadata);
    alert(`Successfully uploaded ${files.length} file(s)`);
  };

  const handleUpdatePermission = (
    documentId: string,
    permissionId: string,
    newAccessLevel: AccessLevel
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            permissions: doc.permissions.map((p) =>
              p.id === permissionId ? { ...p, accessLevel: newAccessLevel } : p
            ),
          };
        }
        return doc;
      })
    );

    if (selectedDocument && selectedDocument.id === documentId) {
      setSelectedDocument((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          permissions: prev.permissions.map((p) =>
            p.id === permissionId ? { ...p, accessLevel: newAccessLevel } : p
          ),
        };
      });
    }
  };

  const handleRevokePermission = (documentId: string, permissionId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            permissions: doc.permissions.filter((p) => p.id !== permissionId),
          };
        }
        return doc;
      })
    );

    if (selectedDocument && selectedDocument.id === documentId) {
      setSelectedDocument((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p.id !== permissionId),
        };
      });
    }
  };

  const handleAddPermission = (
    documentId: string,
    email: string,
    accessLevel: AccessLevel
  ) => {
    const newPermission = {
      id: `dp-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userName: email.split("@")[0],
      userEmail: email,
      accessLevel,
      grantedAt: new Date().toISOString(),
      grantedBy: "current-user@legaltech.com",
    };

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            permissions: [...doc.permissions, newPermission],
          };
        }
        return doc;
      })
    );

    if (selectedDocument && selectedDocument.id === documentId) {
      setSelectedDocument((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          permissions: [...prev.permissions, newPermission],
        };
      });
    }
  };

  return (
    <div className="document-storage__container">
      <div className="document-storage__header">
        <h1>
          <FontAwesomeIcon
            icon={icons.folderOpen}
            style={{ marginRight: "12px" }}
          />
          Secure Document Storage
        </h1>
        <div className="document-storage__actions">
          <button
            className="usa-button"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <FontAwesomeIcon
              icon={icons.upload}
              style={{ marginRight: "8px" }}
            />
            Upload Documents
          </button>
          <button className="usa-button usa-button--outline">
            <FontAwesomeIcon
              icon={icons.folderPlus}
              style={{ marginRight: "8px" }}
            />
            New Folder
          </button>
        </div>
      </div>

      <button
        className="usa-button usa-button--outline document-storage__mobile-toggle"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        <FontAwesomeIcon
          icon={sidebarVisible ? icons.times : icons.bars}
          style={{ marginRight: "8px" }}
        />
        {sidebarVisible ? "Hide Sidebar" : "Show Folders & Accounts"}
      </button>

      <div className="document-storage__content">
        <aside
          className={`document-storage__sidebar ${
            sidebarVisible ? "document-storage__sidebar--mobile-visible" : ""
          }`}
        >
          <div className="document-storage__sidebar-header">
            <h3>Navigation</h3>
            <button
              className="usa-button usa-button--unstyled"
              onClick={() => setSidebarVisible(false)}
              style={{ display: sidebarVisible ? "block" : "none" }}
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={icons.times} />
            </button>
          </div>

          <AccountSelector
            selectedAccountId={selectedAccountId}
            onAccountChange={(accountId) => {
              setSelectedAccountId(accountId || null);
              setSelectedFolderId(null);
            }}
          />

          <div style={{ marginTop: "24px" }}>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#5c5c5c",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Folders
            </h4>
            <FolderTree
              selectedFolderId={selectedFolderId}
              selectedAccountId={selectedAccountId}
              onFolderSelect={(folderId) => {
                setSelectedFolderId(folderId);
                setSidebarVisible(false);
              }}
            />
          </div>
        </aside>

        <main className="document-storage__main">
          <DocumentList
            selectedAccountId={selectedAccountId}
            selectedFolderId={selectedFolderId}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
            onManagePermissions={handleManagePermissions}
          />
        </main>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        selectedAccountId={selectedAccountId}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => {
          setIsPermissionsModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onUpdatePermission={handleUpdatePermission}
        onRevokePermission={handleRevokePermission}
        onAddPermission={handleAddPermission}
      />

      <DocumentViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onDownload={handleDownloadDocument}
        onManagePermissions={(doc) => {
          setIsViewerOpen(false);
          handleManagePermissions(doc);
        }}
      />
    </div>
  );
};

export default DocumentStorageApp;
