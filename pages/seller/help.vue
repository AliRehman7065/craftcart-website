<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold mb-4">Seller Help Center</h1>
        <p class="text-xl text-orange-100">
          Everything you need to know about selling on CraftCart
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <!-- Quick Links -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/seller/dashboard" class="text-orange-600 hover:text-orange-700 flex items-center">
                <span class="mr-2">📊</span> Seller Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/seller/products" class="text-orange-600 hover:text-orange-700 flex items-center">
                <span class="mr-2">📦</span> My Products
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/seller/orders" class="text-orange-600 hover:text-orange-700 flex items-center">
                <span class="mr-2">🛒</span> My Orders
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-orange-600 hover:text-orange-700 flex items-center">
                <span class="mr-2">💬</span> Contact Support
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Stats -->
        <div class="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p class="text-gray-600 mb-4">Our support team is here for you</p>
          <div class="space-y-2 text-sm">
            <p class="flex items-center text-gray-700">
              <span class="mr-2">📧</span> sellers@craftcart.com
            </p>
            <p class="flex items-center text-gray-700">
              <span class="mr-2">📞</span> +91 1800-123-4567
            </p>
            <p class="flex items-center text-gray-700">
              <span class="mr-2">🕐</span> Mon-Sat, 9 AM - 6 PM
            </p>
          </div>
        </div>

        <!-- Resources -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Resources</h2>
          <ul class="space-y-3">
            <li>
              <a href="#getting-started" class="text-gray-700 hover:text-orange-600 flex items-center">
                <span class="mr-2">🚀</span> Getting Started
              </a>
            </li>
            <li>
              <a href="#listing-products" class="text-gray-700 hover:text-orange-600 flex items-center">
                <span class="mr-2">📝</span> Listing Products
              </a>
            </li>
            <li>
              <a href="#managing-orders" class="text-gray-700 hover:text-orange-600 flex items-center">
                <span class="mr-2">📋</span> Managing Orders
              </a>
            </li>
            <li>
              <a href="#payments" class="text-gray-700 hover:text-orange-600 flex items-center">
                <span class="mr-2">💰</span> Payments & Fees
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Help Sections -->
      <div class="space-y-8">
        <!-- Getting Started -->
        <section id="getting-started" class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">🚀 Getting Started</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">How to Register as a Seller</h3>
              <ol class="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Click on "Become a Seller" on the homepage</li>
                <li>Fill in your personal and business details</li>
                <li>Upload samples of your work (at least 3 products)</li>
                <li>Verify your identity (Aadhaar/PAN)</li>
                <li>Wait for approval (usually 2-3 business days)</li>
                <li>Once approved, you can start listing products!</li>
              </ol>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Requirements to Sell</h3>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Must be 18 years or older</li>
                <li>Valid government-issued ID</li>
                <li>Active bank account for receiving payments</li>
                <li>Products must be authentic, handmade items</li>
                <li>Ability to ship products to customers</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Setting Up Your Profile</h3>
              <p class="text-gray-600 mb-2">
                A complete seller profile helps build trust with customers:
              </p>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Add a professional profile photo</li>
                <li>Write a compelling bio about your craft and story</li>
                <li>Specify your location and workshop details</li>
                <li>Upload photos of your workspace (optional but recommended)</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Listing Products -->
        <section id="listing-products" class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">📝 Listing Products</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Creating a Product Listing</h3>
              <ol class="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Go to Seller Dashboard → Products → Add New Product</li>
                <li>Enter product title (clear and descriptive)</li>
                <li>Select appropriate category</li>
                <li>Write detailed description (materials, dimensions, techniques)</li>
                <li>Upload high-quality images (at least 3-5 photos)</li>
                <li>Set price and available stock</li>
                <li>Add estimated production/shipping time</li>
                <li>Save and publish your listing</li>
              </ol>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Photography Tips</h3>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Use natural lighting when possible</li>
                <li>Show product from multiple angles</li>
                <li>Include size reference or scale</li>
                <li>Highlight unique details and craftsmanship</li>
                <li>Use clean, uncluttered backgrounds</li>
                <li>Show product in use (if applicable)</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Pricing Your Products</h3>
              <p class="text-gray-600 mb-2">
                Consider these factors when setting prices:
              </p>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Material costs</li>
                <li>Time and labor involved</li>
                <li>Your skill and expertise level</li>
                <li>Market rates for similar products</li>
                <li>CraftCart commission (10-15%)</li>
                <li>Shipping costs</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Managing Orders -->
        <section id="managing-orders" class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">📋 Managing Orders</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Order Workflow</h3>
              <ol class="list-decimal pl-6 text-gray-600 space-y-2">
                <li><strong>New Order:</strong> You receive notification of new order</li>
                <li><strong>Confirm:</strong> Review and confirm the order within 24 hours</li>
                <li><strong>Prepare:</strong> Create/prepare the product</li>
                <li><strong>Ship:</strong> Pack and ship the product, update tracking</li>
                <li><strong>Delivered:</strong> Customer confirms delivery</li>
                <li><strong>Payment:</strong> Funds transferred to your account</li>
              </ol>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Shipping Guidelines</h3>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Ship within committed timeframe</li>
                <li>Pack products securely to prevent damage</li>
                <li>Use appropriate packaging materials</li>
                <li>Include invoice and seller contact information</li>
                <li>Update tracking information on the platform</li>
                <li>Consider insurance for high-value items</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Handling Cancellations</h3>
              <p class="text-gray-600 mb-2">
                Orders can be cancelled before confirmation. If you need to cancel an order:
              </p>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Contact the customer immediately</li>
                <li>Explain the reason clearly</li>
                <li>Process cancellation through your dashboard</li>
                <li>Note: Frequent cancellations may affect your seller rating</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Payments & Fees -->
        <section id="payments" class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">💰 Payments & Fees</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Commission Structure</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-300">
                  <thead class="bg-orange-50">
                    <tr>
                      <th class="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Commission</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600">
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Handicrafts</td>
                      <td class="border border-gray-300 px-4 py-2">10%</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Textiles</td>
                      <td class="border border-gray-300 px-4 py-2">12%</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Jewelry</td>
                      <td class="border border-gray-300 px-4 py-2">15%</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Other Categories</td>
                      <td class="border border-gray-300 px-4 py-2">10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Payment Schedule</h3>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Payments processed after order is delivered</li>
                <li>7-day waiting period for customer returns/issues</li>
                <li>Funds transferred to your bank account weekly</li>
                <li>Payment history available in your dashboard</li>
                <li>GST applicable as per regulations</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Setting Up Payment Details</h3>
              <p class="text-gray-600 mb-2">
                To receive payments, ensure your bank details are complete:
              </p>
              <ul class="list-disc pl-6 text-gray-600 space-y-2">
                <li>Go to Settings → Payment Settings</li>
                <li>Enter bank account number and IFSC code</li>
                <li>Verify your account (small test deposit)</li>
                <li>Add PAN number for tax purposes</li>
                <li>Update GST information if applicable</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Best Practices -->
        <section class="bg-orange-50 rounded-lg p-8 border-2 border-orange-200">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">✨ Best Practices for Success</h2>
          
          <div class="grid md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Communication</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Respond to customer queries within 24 hours</li>
                <li>Be professional and courteous</li>
                <li>Provide accurate product information</li>
                <li>Keep customers updated on order status</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Quality</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Maintain consistent quality standards</li>
                <li>Package products securely</li>
                <li>Double-check orders before shipping</li>
                <li>Honor product descriptions and images</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Reliability</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Ship within committed timeframes</li>
                <li>Keep adequate stock levels</li>
                <li>Update product availability</li>
                <li>Minimize order cancellations</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Growth</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Regularly add new products</li>
                <li>Collect and act on customer feedback</li>
                <li>Promote your products on social media</li>
                <li>Participate in CraftCart promotions</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact Support -->
      <div class="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
        <p class="text-gray-600 mb-6">
          Our seller support team is here to help you succeed on CraftCart.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
        >
          Contact Seller Support
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Seller Help Center - CraftCart',
  description: 'Complete guide for sellers on CraftCart. Learn how to list products, manage orders, receive payments, and grow your handicraft business.',
})
</script>
