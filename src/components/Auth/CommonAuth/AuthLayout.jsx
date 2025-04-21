import React from 'react';
import { useTheme } from '../../theme-provider';
import { Icon } from '../../../utils/Icon';
import { Carousel, CarouselContent, CarouselItem } from '../../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import carousel_1 from '../../../img/carousel11.png';
import carousel_2 from '../../../img/carousel22.png';
import carousel_3 from '../../../img/carousel33.png';

const imageSources = [
    {
        img: carousel_1,
        description: 'Empower your SaaS business with Quickhunt’s feedback and roadmap tools to engage users and drive product growth.',
    },
    {
        img: carousel_2,
        description: 'Streamline feedback, track progress with roadmaps, and keep users updated through announcements—all in one platform.',
    },
    {
        img: carousel_3,
        description: 'Get started for free and keep your users engaged with timely updates. Join Quickhunt today to shape your product’s future!',
    }
];

const AuthLayout = ({ children }) => {
    const { theme } = useTheme();
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    return (
        <div className="h-full">
            <div className="ltr">
                <div className="min-h-screen bg-background flex items-center overflow-hidden w-full">
                    <div className="min-h-screen basis-full flex w-full justify-center overflow-y-auto">
                        <div className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16">
                            <div className="custom-width">
                                <div className="h-full flex flex-col justify-center">
                                    <div className="app-logo">{theme === 'dark' ? Icon.whiteLogo : Icon.blackLogo}</div>
                                    <Carousel
                                        plugins={[plugin.current]}
                                        className="w-full mt-[25px] mb-[25px]"
                                        onMouseEnter={plugin.current.stop}
                                        onMouseLeave={plugin.current.reset}
                                    >
                                        <CarouselContent>
                                            {imageSources.map((src, index) => (
                                                <CarouselItem key={index} className="max-w-[706px] w-full shrink-0 grow pl-4">
                                                    <img className="w-[706px] mb-6" src={src.img} alt={`Carousel image ${index + 1}`} />
                                                    <p className="text-white text-center mt-4 text-lg">{src.description}</p>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </div>
                        <div className="min-h-screen md:basis-1/2 md:p-16 flex justify-center items-center">
                            <div className="lg:w-[641px] h-full">
                                <div className="w-full h-full pt-5">{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;