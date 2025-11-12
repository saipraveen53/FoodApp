import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import NavBar from './components/NavBar'

const Login = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavBar activeScreen='Login' />
      <View style={styles.container}>
        <Text style={styles.title}>Login Page</Text>
        <Text style={styles.subtitle}>Form goes here...</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
  },
});

export default Login