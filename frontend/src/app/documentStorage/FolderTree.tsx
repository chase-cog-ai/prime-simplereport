import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Folder } from "./types";
import { mockFolders } from "./mockData";
import icons from "./icons";

interface FolderTreeProps {
  selectedFolderId: string | null;
  selectedAccountId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

interface FolderItemProps {
  folder: Folder;
  allFolders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  level: number;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  allFolders,
  selectedFolderId,
  onFolderSelect,
  level,
}) => {
  const childFolders = allFolders.filter((f) => f.parentId === folder.id);
  const isActive = selectedFolderId === folder.id;

  return (
    <li className="folder-tree__item">
      <button
        className={`folder-tree__button ${
          isActive ? "folder-tree__button--active" : ""
        }`}
        onClick={() => onFolderSelect(folder.id)}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        aria-current={isActive ? "true" : undefined}
      >
        <FontAwesomeIcon
          icon={isActive ? icons.folderOpen : icons.folder}
          className="folder-icon"
        />
        <span>{folder.name}</span>
        <span className="document-count">{folder.documentCount}</span>
      </button>
      {childFolders.length > 0 && (
        <ul className="folder-tree__children">
          {childFolders.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              allFolders={allFolders}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedFolderId,
  selectedAccountId,
  onFolderSelect,
}) => {
  const filteredFolders = selectedAccountId
    ? mockFolders.filter((f) => f.accountId === selectedAccountId)
    : mockFolders;

  const rootFolders = filteredFolders.filter((f) => f.parentId === null);

  const totalDocuments = filteredFolders.reduce(
    (sum, folder) => sum + folder.documentCount,
    0
  );

  return (
    <div className="folder-tree">
      <ul className="folder-tree__list">
        <li className="folder-tree__item">
          <button
            className={`folder-tree__button ${
              selectedFolderId === null ? "folder-tree__button--active" : ""
            }`}
            onClick={() => onFolderSelect(null)}
            aria-current={selectedFolderId === null ? "true" : undefined}
          >
            <FontAwesomeIcon icon={icons.home} className="folder-icon" />
            <span>All Documents</span>
            <span className="document-count">{totalDocuments}</span>
          </button>
        </li>
        {rootFolders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            allFolders={filteredFolders}
            selectedFolderId={selectedFolderId}
            onFolderSelect={onFolderSelect}
            level={0}
          />
        ))}
      </ul>
    </div>
  );
};

export default FolderTree;
