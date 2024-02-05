import classNames from "classnames";
import { useState } from "react";
import CustomTab from "shared/components/common/customTabs";
import PurchaseHistory from "shared/components/common/subscription/purchaseHistory";
import TransactionHistory from "shared/components/common/subscription/transactionHistory";
import { SubscriptionTabs } from "shared/utils/pageConstant/kid/profileConstant";

interface PurchaseHistoryProps {
  historyListData: any;
}

const SubscriptionHistory = ({ historyListData }: PurchaseHistoryProps) => {
  const [activeTab, setActiveTab] = useState<string | any>(SubscriptionTabs[0]);
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };

  return (
    <div className={classNames("px-3 px-sm-0 mb-4 w-100")}>
      <CustomTab
        tabs={SubscriptionTabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
      />
      {activeTab === SubscriptionTabs[0] ? (
        <PurchaseHistory historyListData={historyListData} />
      ) : (
        <TransactionHistory />
      )}
    </div>
  );
};

export default SubscriptionHistory;
