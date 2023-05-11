<template>
  <div class="bg-white dark:bg-gray-900">
    <link href="https://fonts.googleapis.com/css?family=Grape Nuts" rel="stylesheet" />
    <div class="flex justify-center h-screen">
      <div class="hidden bg-cover lg:block lg:w-2/3 background1">
        <div class="flex items-start h-full p-10 bg-gray-900 bg-opacity-40">
          <nuxt-link to="/">
            <h2 class="text-6xl font-bold text-white police">DraWin</h2>
          </nuxt-link>
        </div>
      </div>

      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div class="flex-1">
          <div class="text-center">
            <h2 class="text-4xl font-bold text-center text-gray-700 dark:text-white">
              Connexion
            </h2>

            <p class="mt-3 text-gray-500 dark:text-gray-300">
              Entrez les informations de votre compte
            </p>
          </div>

          <div class="mt-8">
            <div>
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >Username</label
                >
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Username"
                  v-model="name"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label for="password" class="text-sm text-gray-600 dark:text-gray-200"
                    >Password</label
                  >
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  v-model="password"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div v-if="errorMessage" class="bg-red-200 py-2 px-4 text-red-800">
                {{ errorMessage }}
              </div>
              <div class="mt-6">
                <button
                  @click="login()"
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Sign in
                </button>
              </div>
            </div>

            <p class="mt-6 text-sm text-center text-gray-400">
              Don't have an account yet?
              <nuxt-link to="/register"
                class="text-blue-500 focus:outline-none focus:underline hover:underline"
                >Sign up</nuxt-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      password: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  layout: "authenticator",
  methods: {
    login() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("password", this.password);
      


      // Effectuer une requête AJAX pour vérifier si les informations d'identification sont correctes
      axios
        .post("http://localhost/my-app/ScribblBack/login.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // Vérifier si les informations d'identification sont correctes
          if (response.data.name) {
            this.successMessage = "Connexion réussie!";
            this.$store.commit('user/addUser', { name: this.name, token: response.data.token })
            this.$router.push({
              path: "/",
            });
          } else {
            this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.background1 {
  background-image: url("../assets/img/bg1.jpg");
}
.police {
    font-family: 'Grape Nuts';
}
</style>
