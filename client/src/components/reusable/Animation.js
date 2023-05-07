import lottie from 'lottie-web';
import {useEffect} from "react";

const Animation = ({animation, speed = 1, id = "animation"}) => {
    useEffect(() => {
        const _animation = lottie.loadAnimation({
            container: document.getElementById(id),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animation,
        });
        _animation.setSpeed(speed);
    }, []);

    return (
        <div id={id} className="animation" />
    );
}

export default Animation;