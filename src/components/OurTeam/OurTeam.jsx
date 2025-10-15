import axios from 'axios';
import Nav from '../Nav/Nav';
import './OurTeam.css';

const OurTeam = () => {
    return ( 
        <>
            <Nav pageTitle="Meet the Team" />
            <div className="team-container">
                <div className="team-content">
                    <div className="three-column-section">
                        <section>
                            <h2>Matt Bissonette</h2>
                            <img className="dev-image" src="" alt="Matt Bissonette" />
                            <h3>Founder</h3>
                            <p>
                                Hi, I'm Matt. Founder of My Outdoor Adventures!
                            </p>
                        </section>

                        <section>
                            <h2>Johnny De Luna</h2>
                            <img className="dev-image" src="johnny.jpeg" alt="Johnny De Luna" />
                            <h3>Full-Stack Developer</h3>
                            <p>
                                Hey there, I'm Johnny! When I'm not developing, you can find me traveling, doing photography, or hanging with friends. 
                            </p>
                        </section>

                        <section>
                            <h2>Charlotte Ganske</h2>
                            <img className="dev-image" src="charlotte.png" alt="Charlotte Ganske" />
                            <h3>Full-Stack Developer</h3>
                            <p>
                                Hello, I'm Charlotte! When im not programming or tinkering with hardware, you can find me relaxing with my three cats, out on the slopes, or having a picnic at my favorite park!
                            </p>
                        </section>

                        <section className="about-rocky-mountain">
                            <h2>Shout-Out</h2>
                            <p>
                                We want to give out a special thanks to all other members of the Rocky Mountain Cohort that were able to lend a hand with kickstarting the development of My Outdoor Adventures. 
                                Without them, this project wouldnt have been possible. In no special order, thank you, Nat Koch, Patricia Kennedy, Teairra Craig, Jorge Lazaro, Bryan McGee.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
         </>
    )
}
export default OurTeam;
