

async function deleteKid(id) {
    console.log(id);
    let result = confirm("¿Estas seguro que quieres realizar esta acción?")
    
    if(result){
        const response = await fetch("/admin/delete/"+id, { 
            method: 'DELETE', 
        }); 
    
        // Awaiting for the resource to be deleted 
        const resData = await 'Resource Deleted...'; 
    
        // Return response data  
        location.replace("/admin");
        return resData; 
    }
    
    
} 
