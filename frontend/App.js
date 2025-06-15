import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';

const BASE_URL = 'https://joy365-test.onrender.com'; // להחליף בעת פריסה בפועל

export default function App() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [stage, setStage] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const fetchSubCategories = async (category) => {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/subcategories?category=${category}`);
    const data = await res.json();
    setSubCategories(data);
    setSelectedCategory(category);
    setStage('subcategories');
    setLoading(false);
  };

  const fetchProducts = async (subCategory) => {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/products?sub_category=${subCategory}`);
    const data = await res.json();
    setProducts(data);
    setSelectedSubCategory(subCategory);
    setStage('products');
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (stage === 'categories') fetchSubCategories(item);
        else if (stage === 'subcategories') fetchProducts(item);
      }}
      style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}
    >
      <Text style={{ fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 200 }} />
      <Text style={{ fontSize: 18, marginVertical: 5 }}>{item.name}</Text>
      <Text style={{ color: '#666' }}>{item.description}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.link)}
        style={{ backgroundColor: '#f06', padding: 10, marginTop: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>לרכישה באתר</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text style={{ fontSize: 22, textAlign: 'center', marginBottom: 10 }}>
        {stage === 'categories' ? 'בחרי קטגוריה' : stage === 'subcategories' ? 'בחרי תת קטגוריה' : 'מוצרים'}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#f06" />
      ) : (
        <FlatList
          data={stage === 'products' ? products : stage === 'subcategories' ? subCategories : categories}
          renderItem={stage === 'products' ? renderProduct : renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}
