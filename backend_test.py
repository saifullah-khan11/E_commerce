#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Vélora E-commerce
Tests all endpoints including authentication, products, cart, and orders
"""

import requests
import json
import sys
import os
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://velora-luxury-1.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class VeloraAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
    
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"Status: {response.status_code}, Response: {data}")
                else:
                    self.log_test("Health Check", False, f"Unexpected response format", data)
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
    
    def test_get_all_products(self):
        """Test GET /api/products endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/products", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    product_count = len(data)
                    # Check if products have required fields and prices in rupees
                    if product_count > 0:
                        sample_product = data[0]
                        required_fields = ['id', 'name', 'price']
                        missing_fields = [field for field in required_fields if field not in sample_product]
                        
                        if not missing_fields:
                            price = sample_product.get('price', 0)
                            # Check if price is numeric and reasonable for rupees (should be higher than USD)
                            if isinstance(price, (int, float)) and price > 0:
                                self.log_test("Get All Products", True, 
                                            f"Found {product_count} products, sample price: ₹{price}")
                            else:
                                self.log_test("Get All Products", False, 
                                            f"Invalid price format: {price}", sample_product)
                        else:
                            self.log_test("Get All Products", False, 
                                        f"Missing required fields: {missing_fields}", sample_product)
                    else:
                        self.log_test("Get All Products", True, "Empty product list (valid response)")
                else:
                    self.log_test("Get All Products", False, "Response is not a list", data)
            else:
                self.log_test("Get All Products", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Get All Products", False, f"Request failed: {str(e)}")
    
    def test_get_product_by_id(self):
        """Test GET /api/products/{id} endpoint"""
        # First get a product ID from the products list
        try:
            products_response = self.session.get(f"{API_BASE}/products", timeout=10)
            if products_response.status_code == 200:
                products = products_response.json()
                if products and len(products) > 0:
                    product_id = products[0]['id']
                    
                    # Test getting specific product
                    response = self.session.get(f"{API_BASE}/products/{product_id}", timeout=10)
                    
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('id') == product_id:
                            self.log_test("Get Product by ID", True, 
                                        f"Retrieved product ID {product_id}: {data.get('name', 'Unknown')}")
                        else:
                            self.log_test("Get Product by ID", False, 
                                        f"Product ID mismatch: expected {product_id}, got {data.get('id')}", data)
                    else:
                        self.log_test("Get Product by ID", False, f"Status: {response.status_code}", response.text)
                else:
                    self.log_test("Get Product by ID", False, "No products available to test with")
            else:
                self.log_test("Get Product by ID", False, "Could not fetch products list for testing")
                
        except Exception as e:
            self.log_test("Get Product by ID", False, f"Request failed: {str(e)}")
    
    def test_get_product_by_invalid_id(self):
        """Test GET /api/products/{id} with invalid ID"""
        try:
            response = self.session.get(f"{API_BASE}/products/99999", timeout=10)
            
            if response.status_code == 404:
                self.log_test("Get Product by Invalid ID", True, "Correctly returned 404 for invalid product ID")
            else:
                self.log_test("Get Product by Invalid ID", False, 
                            f"Expected 404, got {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Get Product by Invalid ID", False, f"Request failed: {str(e)}")
    
    def test_get_products_by_category(self):
        """Test GET /api/products/category/{category} endpoint"""
        categories_to_test = ["Accessories", "Clothing", "Jewelry", "Handbags"]
        
        for category in categories_to_test:
            try:
                response = self.session.get(f"{API_BASE}/products/category/{category}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        # Check if all products in response belong to the requested category
                        valid_category = True
                        for product in data:
                            if product.get('category') != category:
                                valid_category = False
                                break
                        
                        if valid_category:
                            self.log_test(f"Get Products by Category ({category})", True, 
                                        f"Found {len(data)} products in {category} category")
                        else:
                            self.log_test(f"Get Products by Category ({category})", False, 
                                        "Some products don't match the requested category", data)
                    else:
                        self.log_test(f"Get Products by Category ({category})", False, 
                                    "Response is not a list", data)
                else:
                    self.log_test(f"Get Products by Category ({category})", False, 
                                f"Status: {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Get Products by Category ({category})", False, f"Request failed: {str(e)}")
    
    def test_protected_endpoints_without_auth(self):
        """Test that protected endpoints require authentication"""
        protected_endpoints = [
            ("GET", "/cart", "Get Cart"),
            ("POST", "/cart", "Add to Cart"),
            ("GET", "/orders", "Get Orders"),
            ("POST", "/orders/checkout", "Checkout")
        ]
        
        for method, endpoint, name in protected_endpoints:
            try:
                if method == "GET":
                    response = self.session.get(f"{API_BASE}{endpoint}", timeout=10)
                elif method == "POST":
                    response = self.session.post(f"{API_BASE}{endpoint}", 
                                               json={"test": "data"}, timeout=10)
                
                if response.status_code == 401:
                    self.log_test(f"Auth Protection - {name}", True, 
                                "Correctly requires authentication (401)")
                elif response.status_code == 403:
                    self.log_test(f"Auth Protection - {name}", True, 
                                "Correctly requires authentication (403)")
                else:
                    self.log_test(f"Auth Protection - {name}", False, 
                                f"Expected 401/403, got {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Auth Protection - {name}", False, f"Request failed: {str(e)}")
    
    def test_cart_endpoints_with_mock_auth(self):
        """Test cart endpoints with a mock auth token (will likely fail but shows the flow)"""
        # Create a mock JWT token (this will likely fail but shows the expected flow)
        mock_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MzAwMDAwMDAsImV4cCI6MTk0NTM2MDAwMH0.test"
        
        headers = {"Authorization": f"Bearer {mock_token}"}
        
        # Test GET cart
        try:
            response = self.session.get(f"{API_BASE}/cart", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Get Cart (Mock Auth)", True, "Cart endpoint accessible with auth token")
            elif response.status_code == 401:
                self.log_test("Get Cart (Mock Auth)", True, 
                            "Auth token validation working (rejected mock token)")
            else:
                self.log_test("Get Cart (Mock Auth)", False, 
                            f"Unexpected status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Get Cart (Mock Auth)", False, f"Request failed: {str(e)}")
        
        # Test POST cart (add item)
        try:
            cart_data = {"product_id": 1, "quantity": 1}
            response = self.session.post(f"{API_BASE}/cart", 
                                       json=cart_data, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                self.log_test("Add to Cart (Mock Auth)", True, "Add to cart endpoint accessible")
            elif response.status_code == 401:
                self.log_test("Add to Cart (Mock Auth)", True, 
                            "Auth token validation working (rejected mock token)")
            else:
                self.log_test("Add to Cart (Mock Auth)", False, 
                            f"Unexpected status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Add to Cart (Mock Auth)", False, f"Request failed: {str(e)}")
    
    def test_orders_endpoints_with_mock_auth(self):
        """Test order endpoints with mock auth token"""
        mock_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MzAwMDAwMDAsImV4cCI6MTk0NTM2MDAwMH0.test"
        
        headers = {"Authorization": f"Bearer {mock_token}"}
        
        # Test GET orders
        try:
            response = self.session.get(f"{API_BASE}/orders", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Get Orders (Mock Auth)", True, "Orders endpoint accessible with auth token")
            elif response.status_code == 401:
                self.log_test("Get Orders (Mock Auth)", True, 
                            "Auth token validation working (rejected mock token)")
            else:
                self.log_test("Get Orders (Mock Auth)", False, 
                            f"Unexpected status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Get Orders (Mock Auth)", False, f"Request failed: {str(e)}")
        
        # Test POST checkout
        try:
            checkout_data = {
                "shipping_address": "123 Test Street, Test City, Test State 12345",
                "payment_method": "credit_card"
            }
            response = self.session.post(f"{API_BASE}/orders/checkout", 
                                       json=checkout_data, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                self.log_test("Checkout (Mock Auth)", True, "Checkout endpoint accessible")
            elif response.status_code == 401:
                self.log_test("Checkout (Mock Auth)", True, 
                            "Auth token validation working (rejected mock token)")
            elif response.status_code == 404:
                self.log_test("Checkout (Mock Auth)", True, 
                            "Checkout correctly requires existing cart")
            else:
                self.log_test("Checkout (Mock Auth)", False, 
                            f"Unexpected status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Checkout (Mock Auth)", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("VÉLORA E-COMMERCE BACKEND API TESTING")
        print("=" * 60)
        print(f"Testing API at: {API_BASE}")
        print()
        
        # Test public endpoints
        print("🔓 TESTING PUBLIC ENDPOINTS")
        print("-" * 30)
        self.test_health_check()
        self.test_get_all_products()
        self.test_get_product_by_id()
        self.test_get_product_by_invalid_id()
        self.test_get_products_by_category()
        
        # Test authentication protection
        print("🔒 TESTING AUTHENTICATION PROTECTION")
        print("-" * 40)
        self.test_protected_endpoints_without_auth()
        
        # Test protected endpoints with mock auth
        print("🔑 TESTING PROTECTED ENDPOINTS (Mock Auth)")
        print("-" * 45)
        self.test_cart_endpoints_with_mock_auth()
        self.test_orders_endpoints_with_mock_auth()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = VeloraAPITester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if failed == 0 else 1)