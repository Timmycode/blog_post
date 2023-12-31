const express = require ('express')
const router = express.Router()
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
 
router.get('/', async (req, res )=>{
const listOfPosts = await Posts.findAll({include: [Likes] });
res.json(listOfPosts);
});

router.get('/byId/:id', async (req, res) =>{
    const id = req.params.id
    const post = await Posts.findByPk(id);
    res.json(post); 
}) 

router.get('/byuserId/:id', async (req, res) =>{
    const id = req.params.id
    const listOfPosts = await Posts.findAll({where: {username: id},
    include:[ Likes]
    });
    res.json(listOfPosts); 
}) 

router.get('/delId/:id', async (req, res) =>{
    const id = req.params.id
    const post = await Posts.findByPk(id);
    post.destroy();
    res.json(post);
})

router.post("/title", validateToken,async(req, res) =>{
    const { newTitle, id} = req.body;
    
    await Posts.update({title:newTitle}, {where: { id:id }});
    res.json(newTitle);
});

router.post("/", validateToken,async(req, res) =>{
    const post = req.body;
    post.username = req.user.username;
    await Posts.create(post);
    res.json(post);
});

router.put("/postText", validateToken,async(req, res) =>{
    const { newText, id} = req.body;
 
    await Posts.update({postText: newText}, {where: { id:id }});
    res.json(newText);
});

router.put("/title", validateToken,async(req, res) =>{
    const { newTitle, id} = req.body;
     
    await Posts.update({title: newTitle, UserId:req.user.id}, {where: { id:id }});
    res.json(newTitle);
});
 

/*router.delete("/:postId", validateToken, async (req, res) => {
const postId = req.params.postId;
await Posts.destroy({
    where: {
    id: postId,
},
});

res.json("DELETED SUCCESSFULLY");
})*/
module.exports= router