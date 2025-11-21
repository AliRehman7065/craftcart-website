<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
        <p class="text-xl text-orange-100">
          We'd love to hear from you. Get in touch with our team.
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                id="subject"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                v-model="form.message"
                id="message"
                rows="5"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {{ submitting ? 'Sending...' : 'Send Message' }}
            </button>

            <p v-if="submitted" class="text-green-600 text-center">
              Thank you! We'll get back to you soon.
            </p>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                    📧
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Email</h3>
                  <p class="text-gray-600">support@craftcart.com</p>
                  <p class="text-gray-600">sellers@craftcart.com</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                    📞
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Phone</h3>
                  <p class="text-gray-600">+91 1800-123-4567 (Toll Free)</p>
                  <p class="text-gray-600 text-sm">Mon-Sat: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                    📍
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Address</h3>
                  <p class="text-gray-600">
                    CraftCart Headquarters<br>
                    123 Artisan Lane<br>
                    New Delhi, India - 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 rounded-lg p-8 border-2 border-orange-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">For Artisans</h3>
            <p class="text-gray-600 mb-4">
              Interested in selling your crafts on CraftCart? We'd love to hear from you!
            </p>
            <NuxtLink
              to="/auth/register"
              class="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Register as Seller
            </NuxtLink>
          </div>

          <div class="bg-white rounded-lg shadow-md p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-orange-600 transition-colors">
                <span class="text-2xl">📘</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-orange-600 transition-colors">
                <span class="text-2xl">📷</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-orange-600 transition-colors">
                <span class="text-2xl">🐦</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-orange-600 transition-colors">
                <span class="text-2xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const submitted = ref(false)

const submitForm = async () => {
  submitting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  submitting.value = false
  submitted.value = true
  
  // Reset form
  setTimeout(() => {
    form.value = { name: '', email: '', subject: '', message: '' }
    submitted.value = false
  }, 3000)
}

useSeoMeta({
  title: 'Contact Us - CraftCart',
  description: 'Get in touch with CraftCart. We\'re here to help with any questions about our platform, products, or artisan registration.',
})
</script>
