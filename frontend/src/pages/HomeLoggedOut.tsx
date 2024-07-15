import home1 from "../assets/vid/home1.mov";
import home2 from "../assets/img/home2.png";
import home4img1 from "../assets/img/home4-img1.png";
import home4img2 from "../assets/img/home4-img2.png";

const HomeLoggedOut = () => {
    return (
        <>
        <div className="d-flex justify-content-center gap-3 flex-column" style={{ backgroundColor: 'black' }}>
            <div className="home-section d-flex flex-column vh-80 justify-content-center align-items-center overflow-hidden">
                <video src={home1} autoPlay loop muted id="home1-video">Your browser does not support the video tag.</video>
                <div className="home-title-container">
                    <div className="home-title" data-aos="flip-down" data-aos-easing="ease-out" data-aos-delay="0" data-aos-once="true">Clean.</div>
                    <div className="home-title" data-aos="flip-down" data-aos-easing="ease-out" data-aos-delay="50" data-aos-once="true">Simple.</div>
                    <div className="home-title" data-aos="flip-down" data-aos-easing="ease-out" data-aos-delay="100" data-aos-once="true"><span className="home-text-gold">Power</span>ful.</div>
                </div>
                <div className="home-subtitle" data-aos="flip-up" data-aos-easing="ease-in-out" data-aos-delay="150" data-aos-once="true">Maximize your financial insights with Trackspence.</div>
            </div>
            <div className="home-section2 d-flex flex-wrap justify-content-center align-items-center">
                <div className="home2-text d-flex flex-column justify-content-center align-items-center mt-5">
                    <div className="home-title" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="0" data-aos-once="true">Log & Go <i className="fa fa-long-arrow-right"></i></div>
                    <div className="home-subtitle" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="50" data-aos-once="true">Masterfully engineered to provide you with the best experience possible. All it takes is a simple click.</div>
                </div>
                <img src={home2} alt="" id="home2-img" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="100" data-aos-once="true" />
            </div>
            <div className="home-section3 d-flex flex-column vh-80 justify-content-center align-items-center overflow-hidden">
                <div className="home-title" data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-delay="0" data-aos-once="true">Works on all your devices.</div>
                <div className="home-subtitle" data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-delay="50" data-aos-once="true">As a web app, Trackspence work seamlessly across all smart devices. Well, maybe not your watch — yet. But give it a try and tell us how it goes!</div>
            </div>
            <div className="home-section4 row mx-auto">
                <div className="home4-left col-md-6" data-aos="flip-right" data-aos-easing="ease" data-aos-delay="0" data-aos-once="true">
                    <div className="home-title" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="50" data-aos-once="true"><span className="home-text-gold">Gold</span></div>
                    <img src={home4img1} alt="" className="home-4-img" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="100" data-aos-once="true" />
                    <div className="home-subtitle" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="150" data-aos-once="true">Unlock powerful features like budgeting, bill-splitting, and investments tracking.</div>
                </div>
                <div className="home4-right col-md-6" data-aos="flip-left" data-aos-easing="ease" data-aos-delay="0" data-aos-once="true">
                    <div className="home-title" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="50" data-aos-once="true">standard.</div>
                    <img src={home4img2} alt="" className="home-4-img" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="100" data-aos-once="true" />
                    <div className="home-subtitle" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="150" data-aos-once="true">Optimize your savings effortlessly with our cutting-edge Gemini AI-driven solution.</div>
                </div>
            </div>
            <div className="home-section d-flex flex-column vh-100 justify-content-center align-items-center overflow-hidden">
                <div className="home-title" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="0" data-aos-duration="1000" data-aos-mirror="true">And one more thing...</div>
            </div>
            <div className="home-section6 d-flex flex-column vh-80 justify-content-center align-items-center overflow-hidden">
                <div className="home-title" data-aos="fade-down" data-aos-easing="ease" data-aos-delay="0" data-aos-once="true">It's <span className="home-text-green" data-aos="zoom-in" data-aos-easing="ease" data-aos-delay="200">FREE</span></div>
                <div className="home-subtitle" data-aos="fade-down" data-aos-easing="ease-out" data-aos-delay="200" data-aos-once="true">Congratulations! Unlike some other budgeting apps, your first recorded transaction won't be a subscription fee.</div>
            </div>
        </div>
        </>
    );
}

export default HomeLoggedOut;