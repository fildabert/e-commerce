<template>
    <v-container>
        <v-snackbar v-model="alert" top :color="snackbar" class="mt-1">{{msg}}</v-snackbar>

    <div class="text-xs-center">
      <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </div>
        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
					<img :src="imageUrl" height="150" v-if="imageUrl"/>
                    <v-text-field label="Product Title" v-model="title" prepend-icon="add" ></v-text-field>
                    <v-text-field label="Product Price" v-model="price" type="number" prepend-icon="add" ></v-text-field>
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
                        <v-btn color="grey" @click="editProduct">Edit</v-btn>
                  
					<input
						type="file"
						style="display: none"
						ref="image"
						accept="image/*"
						@change="onFilePicked"
					>
				</v-flex>
    </v-container>
</template>

<script>
import axios from "axios"

export default {
    name: "EditProducts",
    created () {
        this.loading = true
        this.$store.dispatch("GET_PRODUCTS")
            .then(() =>{
                this.loading = false
                var id = this.$route.query.id
                var selected = this.$store.getters.GET_PRODUCT_BY_ID(id)
                this.selected = selected
                this.imageUrl = selected.image
                this.imageLinkFromGCS = selected.image
                this.title = selected.title
                this.price = selected.price
                this.stock = selected.stock
                this.selectedType = selected.weaponType
                this.description = selected.description
                this.previousImage = selected.image
            })
            .catch(err =>{
                console.log(err)
            })
        
    },
    data () {
        return {
            selected: "",
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
            previousImage: "",
            alert: false,
            snackbar: "",
            loading: false,
            msg: ""
        }
    },
    methods: {
        editProduct () {
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
                method: "PUT",
                url: `${baseUrl}/products/edit/${this.selected._id}`,
                data: formData,
                headers: {
                    token: sessionStorage.getItem("jwt")
                }
            })
             .then(created =>{
                 this.loading = false
                 console.log(created)
                this.$store.dispatch("GET_PRODUCTS")
                this.$router.push("/admin/modify")
             })
             .catch(err =>{
                this.alert = true
                this.loading = false
                this.snackbar = "red"
                this.msg = err.response.data
                setTimeout(() =>{
                    this.snackbar = ""
                    this.msg = ""
                    this.alert = false
                }, 2500)
             })
        },
        pickFile () {
            this.$refs.image.click ()
        },
		
		onFilePicked (e) {
            // var arr = this.imageUrl.split("/")
            // return storage
            //       .bucket('hacktivgun.fildabert.com')
            //       .file(arr[arr.length-1])
            //       .delete()
            // .then(() =>{
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
                            // axios.post(`${baseUrl}/googleCloudStorage`, formData)
                            //   .then(({ data }) =>{
                            //     this.imageLinkFromGCS = data
                            //     })
                            //   .catch(err =>{
                            //     console.log(err.data)
                            //     })
                    })
                } else {
                    this.imageName = ''
                    this.imageFile = ''
                    this.imageUrl = ''
                }
            // })
		}
    }
}
</script>

<style>

</style>
