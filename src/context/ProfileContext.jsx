import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const apiUrl = process.env.REACT_APP_URL;
      const response = await axios.get(`${apiUrl}/api/v1/auth/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.user) {
        const { profilePicture, name, email, phone } = response.data.user;
        
        // Handle different types of profile picture paths
        let fullProfileUrl;
        if (profilePicture) {
          if (profilePicture.startsWith('http')) {
            fullProfileUrl = profilePicture;
          } else if (profilePicture.startsWith('D:') || profilePicture.startsWith('C:')) {
            const uploadsIndex = profilePicture.indexOf('uploads');
            if (uploadsIndex !== -1) {
              const relativePath = profilePicture.substring(uploadsIndex - 1);
              fullProfileUrl = `${apiUrl}${relativePath}`;
            }
          } else if (profilePicture.startsWith('/')) {
            fullProfileUrl = `${apiUrl}${profilePicture}`;
          }
        }

        setProfileData({
          ...response.data.user,
          profilePicture: fullProfileUrl
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <ProfileContext.Provider value={{ 
      profileData, 
      loading, 
      fetchProfileData,
      setProfileData 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
