import { Artifact, User } from '../../types';

// Define the keys we'll use in localStorage
const ARTIFACTS_KEY = 'closetArtifacts';
const USER_KEY = 'closetUser';

/**
 * Gets all artifacts from local storage.
 * @returns An array of Artifact objects.
 */
export const getArtifacts = (): Artifact[] => {
  try {
    const data = localStorage.getItem(ARTIFACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing artifacts from localStorage:', error);
    return []; // Return empty array on error
  }
};

/**
 * Saves a new artifact to local storage.
 * @param artifact The artifact object to save, without an ID.
 */
export const saveArtifact = (artifact: Omit<Artifact, 'id'>): void => {
  const allArtifacts = getArtifacts();
  
  // Create a new artifact with a unique ID (using timestamp)
  const newArtifact: Artifact = {
    ...artifact,
    id: `artifact_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`,
  };

  allArtifacts.push(newArtifact);
  localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(allArtifacts));
};

/**
 * Gets the local user profile.
 * If one doesn't exist, it creates a default one and saves it.
 * @returns The User object.
 */
export const getLocalUser = (): User => {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  // If no user exists or there's an error, create a new one
  const newUser: User = {
    id: `local-user_${new Date().getTime()}`,
    email: '',
    name: 'ClosetHaus User',
    createdAt: new Date().toISOString(),
    hasOnboarded: false,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
};

/**
 * Updates the user's onboarding status in local storage.
 * @param status The new onboarding status (true/false).
 */
export const setOnboardingStatus = (status: boolean): void => {
  const user = getLocalUser();
  user.hasOnboarded = status;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};