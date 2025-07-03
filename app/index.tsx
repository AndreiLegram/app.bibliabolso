
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      router.push('/login');
    }
  };

  const handleDashboard = () => {
    router.push('/(protected)/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sistema de Gestão</Text>
        <Text style={styles.subtitle}>
          Aplicativo completo com autenticação JWT e CRUD de usuários
        </Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bem-vindo, {user.username}!</Text>
            <TouchableOpacity style={styles.dashboardButton} onPress={handleDashboard}>
              <Text style={styles.dashboardButtonText}>Acessar Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity style={styles.authButton} onPress={handleAuthAction}>
          <Text style={styles.authButtonText}>
            {user ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dashboardButton: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  dashboardButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 120,
  },
  authButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
