const videos = [
    {
        id :  '1',
        title : 'barista',
        duration : 180,
        watched : true
    },
    {
        id :  '2',
        title : 'barista',
        duration : 180,
        watched : true
    },
    {
        id :  '3',
        title : 'barista',
        duration : 180,
        watched : true
    },
    {
        id : '4',
        title : 'Embrace the martian',
        duration : 180,
        watched : true
    }
];

const getVideoById = (id) => new Promise((resolve, reject)=>{
    const [video] = videos.filter( (video) => {
        return video.id === id;
    });

    video ? resolve(video) : reject( new Error('Not Found'));
});

const getVideos = () => new Promise((resolve=>{
   resolve(videos);
}));

const createVideo = ({ title, duration, watched=false })=>{
    const video = {
        id: title,
        title,
        duration,
        watched
    };

    videos.push(video);

    return video;
};

module.exports =  {
    getVideoById,
    getVideos,

    createVideo
};
