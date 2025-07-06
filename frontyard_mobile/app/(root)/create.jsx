import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";
import { CATEGORIES } from "../../constants/categories";
import { COLORS } from "../../constants/colors";

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const defaultStyles = useDefaultStyles();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());
  const [isExpense, setIsExpense] = useState(true);
  //   const [isPayment, setIsPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    //form validations
    if (!title.trim()) return Alert.alert("Error", "Enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Enter a valid amount");
    }
    if (!selectedCategory) return Alert.alert("Error", "Select a category");
    setIsLoading(true);
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));
      console.log(user.id);
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
          transaction_date: selectedDate.toISOString().split("T")[0],
          due_date: selectedDueDate.toISOString().split("T")[0],
        }),
      });
      //   console.log(selectedDate, selectedDate.toISOString().split("T")[0]);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData, user.id);
        throw new Error(errorData.error || "Failed to create transaction");
      }

      Alert.alert("Success", "successfully created transaction");
      router.back();
    } catch (error) {
      Alert.alert(
        "Error Alert",
        error.message || "Failed to create transaction"
      );
      console.error("Error creating the transaction: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* header element */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text}></Ionicons>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.card}>
          {/* transaction date picker */}
          <View>
            <Text style={styles.sectionTitle}>Transaction Date</Text>
            <DateTimePicker
              mode="single"
              date={selectedDate}
              onChange={({ date }) => setSelectedDate(date)}
              styles={defaultStyles}
            />
          </View>
          {/* expenses selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, isExpense && styles.typeButtonActive]}
              onPress={() => setIsExpense(true)}
            >
              <Ionicons
                name="arrow-down-circle"
                size={22}
                color={isExpense ? COLORS.white : COLORS.expense}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isExpense && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            {/* Income selector */}
            <TouchableOpacity
              style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
              onPress={() => setIsExpense(false)}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={!isExpense ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  !isExpense && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            {/* payment selector
            <TouchableOpacity
              style={[styles.typeButton, isExpense && styles.typeButtonActive]}
              onPress={() => setIsExpense(true) && setIsPayment(true)}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={isExpense ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isExpense && styles.typeButtonTextActive,
                ]}
              >
                Payment
              </Text>
            </TouchableOpacity> */}
          </View>
          {/* amounts container */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={COLORS.textLight}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          {/* input container */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="create-outline"
              size={22}
              color={COLORS.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Transaction Name"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* categories container */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />
            Category
          </Text>
          {/* categories list */}
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={
                    selectedCategory === category.name
                      ? COLORS.white
                      : COLORS.text
                  }
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    selectedCategory === category.name &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* due date selector */}
          <View
            style={
              selectedCategory === "CC Payment"
                ? { display: "normal" }
                : { display: "none" }
            }
          >
            <Text style={styles.sectionTitle}>Due Date</Text>
            <DateTimePicker
              mode="single"
              date={selectedDueDate}
              onChange={({ date }) => setSelectedDueDate(date)}
              styles={defaultStyles}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateScreen;
