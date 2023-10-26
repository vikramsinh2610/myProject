<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal" :class="{sale: theme==='sale', 'Dissocia': theme==='Dissocia'  }">
           <slot></slot>
           
           <h2>{{header}}</h2>
       
            <p>{{text}}</p>
        </div>
    </div>
</template>

<script>
export default{
    props:['header', 'text', 'theme',],
    /*methods: {
        closeModal(){
            this.$emit('close')
        }
    }*/
}

</script>

<style>
.modal{
    width:400px;
    min-height:200px;
    padding: 20px;
    margin: 100px auto; 
    background: white;
    border-radius: 10px;
    border: 4px solid rgb(14, 153, 33);
}
.backdrop{
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.419);
    width: 100%;
    height:100%;
}
.modal h2{
    color: rgb(14, 153, 33);
    border: none;
    padding: 0;
    text-align: center;
    font-style: italic;

}
.modal p{
    font-style: normal;
    text-align: center;
    margin-top: 20px;
}
.modal .actions{
    text-align:center;
    margin: 30px 0 10px 0;
}
.modal .actions a {
    color: #333;
    padding: 8px;
    border:1px solid #eee;
    border-radius: 4px;
    text-decoration: none;
    margin:10px;
}


.modal.sale{
    min-width:600px;
    min-height: 330px;
    padding: 20px;
    padding-bottom: 10px;
    margin: 100px auto; 
    background: rgb(255, 221, 229);
    border-radius: 10px;
    border: 4px solid rgb(221, 0, 0);
}
.modal.sale h3{
    color: #333;
    font-style: italic;
    width: 100%;
    text-align: center;
}


 .modal.sale .actions{
     color:white;
 }
 .modal.sale .actions a{
     color: white;
 }
.modal.sale .linkImg a{
    width:50px,

}

.modal.Dissocia{
    min-width:200px;
    min-height: 180px;
    padding: 20px;
    margin: 100px auto; 
    background: rgb(239, 238, 238);
    border-radius: 10px;
    border: 4px solid rgb(120, 52, 52);
}
.modal.Dissocia h3{
    color: #333;
    font-style: italic;
    width: 100%;
    text-align: center;
}
.modal.Dissocia p{
    font-style: normal;
    text-align: center;
    margin-top: 20px;
}
.btnOkStyle{
    background-color: transparent !important;
    float: right;
    text-shadow: 1px 1px #3a383850;
}
</style>