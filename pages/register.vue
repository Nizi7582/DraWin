<template>
  <section class="bg-gradient-to-r from-green-500 to-blue-400 h-screen">
    <div class="max-w-7xl mx-auto border-x-2 border-gray-800 px-6 h-full text-gray-800">
      <div
        class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
      >
        <div
          class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="w-full"
            alt="Sample image"
          />
        </div>
        <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
          <div>

            <div class="mb-6">
              <input
                type="text"
                v-model="name"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleFormControlInput2"
                placeholder="Name"
              />
            </div>

            <!-- Email input -->
            <div class="mb-6">
              <input
                type="text"
                v-model="email"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleFormControlInput2"
                placeholder="Email address"
              />
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input
                type="password"
                v-model="password"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
              />
            </div>

            <div class="flex justify-between items-center mb-6">
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  id="exampleCheck2"
                />
                <label
                  class="form-check-label inline-block text-gray-800"
                  for="exampleCheck2"
                  >Remember me</label
                >
              </div>
              <a href="#!" class="text-gray-800">Forgot password?</a>
            </div>

            <div class="text-center lg:text-left">
              <button
                type="button"
                @click="register()"
                class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import axios from "axios";

export default {
  layout: "authenticator",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      successMessage: "",
      errorMessage: "",
      errorMail: "",
    };
  },
  methods: {
    register() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("email", this.email);
      formData.append("password", this.password);

      // Vérifier que les champs sont remplis
      if (!this.name || !this.email || !this.password) {
        this.errorMessage = "Veuillez remplir tous les champs";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3500); // masquer le message après 3,5 secondes
        return;
      }

      axios
        .post("http://localhost/my-app/ScribblBack/register.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data === "Un utilisateur avec cet email existe déjà.") {
            this.errorMail = response.data;
            setTimeout(() => {
              this.errorMail = "";
            }, 3500);
            return;
          }
          this.$store.commit('user/addUser', { name: this.name, email: this.email, token: response.data.token })
          this.successMessage = "Utilisateur enregistré avec succès!";

          console.log(response.data);
          setTimeout(() => {
            this.successMessage = "";
          }, 5000);
          this.$router.push({
              path: "/",
            });
          // masquer le message après 5 secondes
          this.email = "";
          this.password = "";
        })

        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.background {
  background-image: url("../assets/img/background.jpg");
}
</style>
