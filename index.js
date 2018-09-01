'user strict';
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
 } =  require('graphql');

const log = require("emoji-logger");

const { getVideoById, getVideos, createVideo } = require('./src/index.js');
const nodeInterface = require('./src/node.js');


const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name : 'Video',
    description : 'A video about cats',
    fields: {
        id: {
            type : new GraphQLNonNull( GraphQLID ),
            description: 'The id of the video'
        },
        title : {
            type : GraphQLString,
            description : 'The title of the video'
        },
        duration:{
            type : GraphQLInt,
            description : 'The duration of the video in seconds'
        },

        watched : {
            type : GraphQLBoolean,
            description: 'Whether or not the view watched the video'
        }
    },

    interfaces: [nodeInterface]
});


// const videosType = new GraphQLList({
//     name: 'List of Videos',
//     descripion: 'A list of videos',
//     fields : {
//         video : videoType
//     }
// })

const queryType = new GraphQLObjectType({
    name : 'QueryType',
    description: 'The root query type',
    fields: {
        video : {
            type : videoType,
            args: {
                id : {
                    type : new GraphQLNonNull( GraphQLID ),
                    description: 'Id of the video'
                }
            },

            resolve : (_, args ) => getVideoById( args.id )
        },

        videos : {
            type : new GraphQLList(videoType),
            resolve: getVideos    
        }
    }
});

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
        title : {
            type : new GraphQLNonNull( GraphQLString ),
            description : 'The title of the video'
        },
        duration:{
            type : new GraphQLNonNull( GraphQLInt ),
            description : 'The duration of the video in seconds'
        },

        watched : {
            type : GraphQLBoolean,
            description: 'Whether or not the view watched the video'
        }
    }
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description:'The root Mutation type.',
    fields: {
        createVideo:{
            type : videoType,
            args:{
                video : {
                    type : new GraphQLNonNull(videoInputType)
                }
                // title : {
                //     type : new GraphQLNonNull( GraphQLString ),
                //     description : 'The title of the video'
                // },
                // duration:{
                //     type : new GraphQLNonNull( GraphQLInt ),
                //     description : 'The duration of the video in seconds'
                // },
        
                // watched : {
                //     type : GraphQLBoolean,
                //     description: 'Whether or not the view watched the video'
                // }
            },

            resolve: (_, args) => {
                return createVideo( args.video);
            }
        }
    }
})

const schema = new GraphQLSchema({
    query : queryType,
    mutation: mutationType
})


server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen( PORT , () => {
    log(`Listening at http://localhost:${ PORT }` , 'success');
});


exports.videoType = videoType;