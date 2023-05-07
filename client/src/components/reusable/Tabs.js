import { ContentContainer, TabItem, TabsContainer, VerticalTabsContainer } from "./Tabs.style";
import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <VerticalTabsContainer>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            active={tab.id === activeTab}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </TabItem>
        ))}
      </TabsContainer>
      <ContentContainer>{activeTabContent}</ContentContainer>
    </VerticalTabsContainer>
  );
};

export default Tabs;
