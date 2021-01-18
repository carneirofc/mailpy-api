const makeController=({ database })=> {
    const db = await database;
    
    const getById = async (id)=>{
        const found = db.collection("users").findOne({
            id: { $eq: id },
        });
        if(found){
            //@todo: Have a user type
            return found;
        }
        return null;
    }

    const addUser = async ({id, email, name, grants})=>{
        return db.collection("users").insert({
            id: id,
            email: email,
            name: name,
            grants: grants,
        });
    }

    return Object.freeze({
        getById,
        addUser
    });
}
export default makeController;