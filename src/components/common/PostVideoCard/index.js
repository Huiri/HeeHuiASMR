import React, { useEffect, useState } from 'react';
import { PromotionChannel, PromotionTitle, PromotionWrapper, StyledLink, VideoThumbnail, VideoWrapper } from './styled';
import Loading from '../../../Utils/Spinner';
import { useRecoilValue } from 'recoil';
import { VideoState } from '../../../States/VideoStates';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostVideoCard = ({page, order, param, count, data}) => {
    const video = useRecoilValue(VideoState);

    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [videoList, setVideoList] = useState([]);
    const PAGE_LIMIT = 50;
    const offset = (page - 1) * count;
    const [word, setWord] = useState(param);

    const fetchData = (word) => {
        setIsLoading(true);

        axios
        //AIzaSyBmNXK-4gvjD7785WFaQVbuGCQwWErPKUA
            .get(

                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=ASMR${word}&maxResults=4&type=video&regionCode=KR&key=AIzaSyCHAdXUjuGX9fznEeA6Fz6EHpABipgxN98`
                // `https://www.googleapis.com/youtube/v3/search?part=snippet&q=먹방${param}&order=${orders}&maxResults=8&type=video&regionCode=KR&key=AIzaSyBmNXK-4gvjD7785WFaQVbuGCQwWErPKUA`
            )
            .then((res) => {
                //console.log(res);
                // setVideoList(res.data.items);
                setIsLoading(false);
                setVideoList(items => [...items, ...res.data.items]);
                setHasMore(page !== PAGE_LIMIT);

            })
            .catch(() => {
                console.warn("error");
                setHasMore(false);
            });
    };

    useEffect(()=>{
        if(data !== null){
            setVideoList(video);
        } else {
            fetchData(word);
        }

    },[]);

    const [number, setNumber] = useState(1);
    useEffect(() => {
        setIsLoading(true);
        setNumber(number+1);
    },[page]);

    useEffect(()=>{
        setIsLoading(false);
        setShowVideo(videoList.slice(offset, ( offset+12)));
    }, [number]);

    const [showVideo, setShowVideo] = useState([]);

    const findCategory = (array) => {
        const real = [...array];
        if(param === '전체'){
            return real;
        } else {
            return real.filter(e => e.category === param);
        }

    };
    useEffect(() => {
        setShowVideo([]);
        setShowVideo(findCategory(videoList));
        // fetchData(param);

    }, [param]);

    useEffect(()=>{
        setWord(param);
    },[param]);

    useEffect(()=>{
        setIsLoading(false);
    }, [showVideo]);
    return (
        <>
            {isLoading ? <Loading /> : null}
            {showVideo &&
            showVideo.slice(offset, offset+count).map((show) => {
                return (
                    <PromotionWrapper key={show.video_idx}>
                        <StyledLink to={`/detail/${show.videoId}`}  state={{ data: show }}>
                            <VideoWrapper>
                                <VideoThumbnail className={show.id} src={show.thumbnail} alt=""/>
                                <PromotionTitle>{show.title}</PromotionTitle>
                                <PromotionChannel>{show.creator}</PromotionChannel>

                            </VideoWrapper>
                        </StyledLink>
                    </PromotionWrapper>

                );
            })}
        </>
    );
};

export default PostVideoCard;