
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../../../services/api';
import { theme } from '../../../styles/theme';

export default function CreateUserScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    } else if (formData.password.length > 30) {
      newErrors.password = 'Senha deve ter no máximo 30 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        active: formData.active,
      };

      await userService.create(userData);
      Alert.alert('Sucesso', 'Usuário criado com sucesso', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Usuário</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome de Usuário *</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              value={formData.username}
              onChangeText={(value) => updateFormData('username', value)}
              placeholder="Digite o nome de usuário"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Digite o email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              placeholder="Digite a senha (6-30 caracteres)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              placeholder="Confirme a senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role *</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleOption, formData.role === 'User' && styles.roleOptionActive]}
                onPress={() => updateFormData('role', 'User')}
              >
                <Text style={[styles.roleText, formData.role === 'User' && styles.roleTextActive]}>
                  User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleOption, formData.role === 'Admin' && styles.roleOptionActive]}
                onPress={() => updateFormData('role', 'Admin')}
              >
                <Text style={[styles.roleText, formData.role === 'Admin' && styles.roleTextActive]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[styles.switchOption, formData.active && styles.switchOptionActive]}
                onPress={() => updateFormData('active', true)}
              >
                <Text style={[styles.switchText, formData.active && styles.switchTextActive]}>
                  Ativo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchOption, !formData.active && styles.switchOptionActive]}
                onPress={() => updateFormData('active', false)}
              >
                <Text style={[styles.switchText, !formData.active && styles.switchTextActive]}>
                  Inativo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color={theme.colors.white} />
                <Text style={styles.submitButtonText}>Criar Usuário</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.white,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  roleOption: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  roleOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  roleText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  roleTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  switchOption: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  switchOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  switchText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  switchTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
