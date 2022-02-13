import React, { useContext, useEffect, useState } from 'react';

import ApiContext from './ApiContext';

const OrganizationContext = React.createContext({
  currentOrganization: null,
  otherOrganizations: null,
  switchOrganization: () => {
    throw new Error();
  },
});

export const OrganizationContextProvider = function ({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const { apiClient, isLoggedIn } = useContext(ApiContext);

  useEffect(() => {
    async function loadOrgs() {
      setIsLoading(true);
      try {
        const newOrganizations = await apiClient.getOrganizations();
        setOrganizations(newOrganizations);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    if (apiClient && isLoggedIn) {
      loadOrgs();
    } else {
      setOrganizations([]);
    }
  }, [apiClient, isLoggedIn]);

  const changeOrganization = (org) => {
    const newOrg = organizations.find((o) => o.id === org.id);
    if (!newOrg) {
      return;
    }
    const otherOrgs = organizations.filter((o) => o.id !== newOrg.id);
    setOrganizations([newOrg, ...otherOrgs]);
  };

  const currentOrganization = organizations.length ? organizations[0] : null;
  const otherOrganizations = organizations.length
    ? organizations.slice(1, organizations.length)
    : [];

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        otherOrganizations,
        changeOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const OrganizationContextConsumer = OrganizationContext.Consumer;
export default OrganizationContext;
