<template>
    <v-container>
            <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <!-- <v-alert v-model="alert" dismissible type="error">{{errormsg}}</v-alert> -->
            <v-snackbar
            v-model="alert"
            top
            color="red"
            class="mt-1"
            >
                {{errormsg}}
            </v-snackbar>
            
            <img :src="imageUrl" height="150" v-if="imageUrl"/>
            <v-text-field label="Product Title" v-model="title" prepend-icon="add"></v-text-field>
            <v-text-field label="Product Price" v-model="price" type="number" prepend-icon="add"></v-text-field>
            <v-select
            :items="type"
            label="Select Type"
            prepend-icon="add"
            v-model="selectedType"
            ></v-select>
            <v-layout row wrap>
                <v-flex xs10>
            <v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>

                </v-flex>

                <v-flex xs2>
            <v-text-field label="Input Stock" type="number" v-model="stock" prepend-icon="add"></v-text-field>

                </v-flex>
                <v-textarea
                    name="input-7-1"
                    label="Description"
                    hint="Add a description of the gun"
                    v-model="description"
                ></v-textarea>
            </v-layout>
                <v-btn color="grey" @click="addProduct" class="mr-5">Add</v-btn>
            
            <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
            >
				</v-flex>


            <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">Access Denied: Unauthorized</v-card-title>
                        <v-card-text>Only admins are allowed to access this page, contact the developers to get an admin key.</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="closeDialog">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
    </v-container>
</template>

<script>
import axios from "axios"

export default {
    name: "ModifyProducts",
    created () {
        if(!this.$store.state.admin) {
            this.dialog = true
        }
    },
    data () {
        return {
            title: "",
            price: "",
            type: ["Assault Rifle", "SMG", "Sniper Rifle", "Handgun"],
            description: "",
            selectedType: "",
            stock: 0,
            dialog: false,
            imageName: "",
            imageUrl: "",
            imageFile: "",
            imageLinkFromGCS: "",
            errormsg: "",
            alert: false,
            dialog: false,
            loading: false
        }
    },
    methods: {
        addProduct () {
            this.loading = true
            var baseUrl = this.$store.state.baseUrl
            var formData = new FormData()
            formData.append("image", this.imageFile)
            formData.append("title", this.title)
            formData.append("description", this.description)
            formData.append("price", this.price)
            formData.append("weaponType", this.selectedType)
            formData.append("stock", this.stock)

            axios.request({
                method: "POST",
                url: `${baseUrl}/products/add`,
                data: formData,
                headers:{
                    token: sessionStorage.getItem("jwt")
                }
            })
             .then(created =>{
                this.$store.dispatch("GET_PRODUCTS")
                this.$router.push("/products")
                this.loading = false
             })
             .catch(err =>{
                 this.loading = false
                 this.alert = true
                 this.errormsg = err.response.data
                 console.log(err.response.data)
                 setTimeout(() => this.alert = "", 5000)
             })
        },
        pickFile () {
            this.$refs.image.click ()
        },
		
		onFilePicked (e) {
            var baseUrl = this.$store.state.baseUrl
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
                    this.imageFile = files[0] // this is an image file that can be sent to server...
                    // const formData = new FormData()
                    //     formData.append('image',this.imageFile)
                    //     axios.post(`${baseUrl}/googleCloudStorage`, formData)
                    //       .then(({ data }) =>{
                    //         this.imageLinkFromGCS = data
                    //         })
                    //       .catch(err =>{
                    //         console.log(err.data)
                    //         })
                })
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
        },
        closeDialog: function () {
            this.dialog = false
            this.$router.push("/products")
        }
    }
}
</script>

<style>

</style>
