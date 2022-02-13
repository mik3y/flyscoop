import React, { useContext, useEffect, useState } from 'react';

import ApiContext from './ApiContext';
import SettingsContext from './SettingsContext';

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
  const { defaultOrgId, setDefaultOrgId } = useContext(SettingsContext);
  const [currentOrgId, setCurrentOrgId] = useState(defaultOrgId);

  useEffect(() => {
    async function loadOrgs() {
      setIsLoading(true);
      try {
        const newOrganizations = await apiClient.getOrganizations();
        setOrganizations(sortOrgs(newOrganizations, currentOrgId));
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

  // Sort selected org to top whenever it changes.
  useEffect(() => {
    setOrganizations(sortOrgs(organizations, currentOrgId));
  }, [currentOrgId]);

  const sortOrgs = (orgs, firstOrgId) => {
    const selectedOrg = orgs.find((o) => o.id === firstOrgId);
    if (!selectedOrg) {
      return orgs;
    }
    return [selectedOrg, ...orgs.filter((o) => o.id !== selectedOrg.id)];
  };

  const changeOrganization = (org) => {
    setCurrentOrgId(org.id);
    setDefaultOrgId(org.id);
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
