import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "../commonComponents/Modal";
import Dropdown from "../commonComponents/Dropdown";
import TextInput from "../commonComponents/TextInput";

import { Document, AccessLevel } from "./types";
import { getAccessLevelLabel } from "./mockData";
import icons from "./icons";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onUpdatePermission: (
    documentId: string,
    permissionId: string,
    newAccessLevel: AccessLevel
  ) => void;
  onRevokePermission: (documentId: string, permissionId: string) => void;
  onAddPermission: (
    documentId: string,
    email: string,
    accessLevel: AccessLevel
  ) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  document,
  onUpdatePermission,
  onRevokePermission,
  onAddPermission,
}) => {
  const [newEmail, setNewEmail] = useState("");
  const [newAccessLevel, setNewAccessLevel] = useState<AccessLevel>(
    AccessLevel.VIEW
  );
  const [emailError, setEmailError] = useState("");

  if (!document) return null;

  const accessLevelOptions = Object.values(AccessLevel)
    .filter((level) => level !== AccessLevel.OWNER)
    .map((level) => ({
      value: level,
      label: getAccessLevelLabel(level),
    }));

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddPermission = () => {
    if (!newEmail.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (
      document.permissions.some(
        (p) => p.userEmail.toLowerCase() === newEmail.toLowerCase()
      )
    ) {
      setEmailError("This user already has access to this document");
      return;
    }

    onAddPermission(document.id, newEmail, newAccessLevel);
    setNewEmail("");
    setNewAccessLevel(AccessLevel.VIEW);
    setEmailError("");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClose = () => {
    setNewEmail("");
    setNewAccessLevel(AccessLevel.VIEW);
    setEmailError("");
    onClose();
  };

  return (
    <Modal
      showModal={isOpen}
      onClose={handleClose}
      contentLabel={`Manage permissions for ${document.name}`}
    >
      <div className="permissions-modal">
        <h2>
          <FontAwesomeIcon
            icon={icons.usersCog}
            style={{ marginRight: "12px" }}
          />
          Manage Permissions
        </h2>
        <p style={{ color: "#5c5c5c", marginBottom: "24px" }}>
          <strong>{document.name}</strong>
        </p>

        <div className="permissions-modal__current">
          <h4>Current Access ({document.permissions.length})</h4>
          {document.permissions.length === 0 ? (
            <p style={{ color: "#71767a", fontStyle: "italic" }}>
              No permissions have been granted yet.
            </p>
          ) : (
            <ul className="permissions-modal__permission-list">
              {document.permissions.map((permission) => (
                <li
                  key={permission.id}
                  className="permissions-modal__permission-item"
                >
                  <div className="user-info">
                    <div className="user-avatar">
                      {getInitials(permission.userName)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{permission.userName}</div>
                      <div className="user-email">{permission.userEmail}</div>
                    </div>
                  </div>
                  <div className="permission-controls">
                    {permission.accessLevel === AccessLevel.OWNER ? (
                      <span
                        className="usa-tag"
                        style={{ backgroundColor: "#1a4480", color: "white" }}
                      >
                        Owner
                      </span>
                    ) : (
                      <>
                        <Dropdown
                          id={`permission-${permission.id}`}
                          selectedValue={permission.accessLevel}
                          onChange={(e) =>
                            onUpdatePermission(
                              document.id,
                              permission.id,
                              e.target.value as AccessLevel
                            )
                          }
                          options={accessLevelOptions}
                          ariaLabel={`Change access level for ${permission.userName}`}
                        />
                        <button
                          className="revoke-btn"
                          onClick={() =>
                            onRevokePermission(document.id, permission.id)
                          }
                          title="Revoke access"
                          aria-label={`Revoke access for ${permission.userName}`}
                        >
                          <FontAwesomeIcon icon={icons.trashAlt} />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="permissions-modal__add-section">
          <h4>
            <FontAwesomeIcon
              icon={icons.userPlus}
              style={{ marginRight: "8px" }}
            />
            Grant Access
          </h4>
          <div className="permissions-modal__add-form">
            <div className="form-group">
              <label htmlFor="new-user-email">Email Address</label>
              <TextInput
                name="new-user-email"
                idString="new-user-email"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="user@example.com"
                ariaDescribedBy={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <span
                  id="email-error"
                  className="usa-error-message"
                  role="alert"
                >
                  {emailError}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="new-access-level">Access Level</label>
              <Dropdown
                id="new-access-level"
                selectedValue={newAccessLevel}
                onChange={(e) =>
                  setNewAccessLevel(e.target.value as AccessLevel)
                }
                options={accessLevelOptions}
                ariaLabel="Select access level for new user"
              />
            </div>
            <button
              type="button"
              className="usa-button add-btn"
              onClick={handleAddPermission}
            >
              <FontAwesomeIcon
                icon={icons.plus}
                style={{ marginRight: "8px" }}
              />
              Grant Access
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <h5 style={{ margin: "0 0 8px", fontSize: "14px" }}>
            <FontAwesomeIcon
              icon={icons.infoCircle}
              style={{ marginRight: "8px" }}
            />
            Access Level Descriptions
          </h5>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              fontSize: "13px",
              color: "#5c5c5c",
            }}
          >
            <li>
              <strong>View Only:</strong> Can view the document but cannot
              download
            </li>
            <li>
              <strong>View & Download:</strong> Can view and download the
              document
            </li>
            <li>
              <strong>Edit:</strong> Can view, download, and make changes to the
              document
            </li>
            <li>
              <strong>Delete:</strong> Can view, download, edit, and delete the
              document
            </li>
            <li>
              <strong>Manage:</strong> Full access including managing
              permissions
            </li>
          </ul>
        </div>

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
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionsModal;
