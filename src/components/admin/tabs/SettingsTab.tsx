import {ScrollView, StyleSheet, Text} from 'react-native';

const SettingsTab = () => {
  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.comingSoon}>Settings - Coming Soon</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SettingsTab;
