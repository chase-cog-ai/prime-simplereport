import React from "react";

import Dropdown from "../commonComponents/Dropdown";

import { AccountStatus, AccountType } from "./types";
import { mockAccounts } from "./mockData";

interface AccountSelectorProps {
  selectedAccountId: string | null;
  onAccountChange: (accountId: string) => void;
}

const getAccountTypeLabel = (type: AccountType): string => {
  const labels: Record<AccountType, string> = {
    [AccountType.INDIVIDUAL]: "Individual",
    [AccountType.CORPORATE]: "Corporate",
    [AccountType.GOVERNMENT]: "Government",
    [AccountType.NON_PROFIT]: "Non-Profit",
  };
  return labels[type];
};

const getStatusBadgeClass = (status: AccountStatus): string => {
  const classes: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: "usa-tag--success",
    [AccountStatus.SUSPENDED]: "usa-tag--error",
    [AccountStatus.PENDING]: "usa-tag--warning",
    [AccountStatus.ARCHIVED]: "usa-tag--default",
  };
  return classes[status];
};

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  selectedAccountId,
  onAccountChange,
}) => {
  const selectedAccount = mockAccounts.find(
    (acc) => acc.id === selectedAccountId
  );

  const accountOptions = mockAccounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  return (
    <div className="account-selector">
      <label className="account-selector__label" htmlFor="account-select">
        Client Account
      </label>
      <Dropdown
        id="account-select"
        className="account-selector__dropdown"
        selectedValue={selectedAccountId || ""}
        onChange={(e) => onAccountChange(e.target.value)}
        options={[{ value: "", label: "All Accounts" }, ...accountOptions]}
        ariaLabel="Select client account"
      />
      {selectedAccount && (
        <div className="account-selector__info">
          <p>
            <strong>Type:</strong> {getAccountTypeLabel(selectedAccount.type)}
          </p>
          <p>
            <strong>Contact:</strong> {selectedAccount.primaryContact}
          </p>
          <p>
            <strong>Email:</strong> {selectedAccount.email}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`usa-tag ${getStatusBadgeClass(
                selectedAccount.status
              )}`}
            >
              {selectedAccount.status}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
