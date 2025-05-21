// AdminScreen.tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AdminStackParamList} from '../../navigation/AdminStack';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  AdminStackParamList & RootStackParamList,
  'Admin'
>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminScreen = ({navigation}: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching users from an API
    const fetchUsers = async () => {
      try {
        // Replace with actual API call
        const mockUsers: User[] = [
          {id: '1', name: 'John Doe', email: 'john@example.com', role: 'User'},
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Admin',
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'User',
          },
          {
            id: '4',
            name: 'Alice Brown',
            email: 'alice@example.com',
            role: 'User',
          },
          {
            id: '5',
            name: 'Charlie Davis',
            email: 'charlie@example.com',
            role: 'Moderator',
          },
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Clear any stored credentials or tokens here
    navigation.navigate('Auth', {
      screen: 'Login',
    });
  };

  const handleNavigateToApp = () => {
    navigation.navigate('App', {
      screen: 'Home',
    });
  };

  const renderUser = ({item}: {item: User}) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => alert(`Manage user: ${item.name}`)}>
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{users.length}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {users.filter(user => user.role === 'Admin').length}
                </Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {users.filter(user => user.role === 'User').length}
                </Text>
                <Text style={styles.statLabel}>Regular Users</Text>
              </View>
            </View>
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleNavigateToApp}>
          <Text style={styles.backButtonText}>Back to App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  roleContainer: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  userRole: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// Use React Native's Alert API for cross-platform alerts

function alert(message: string): void {
  Alert.alert('Notice', message, [{text: 'OK'}]);
}

export default AdminScreen;
