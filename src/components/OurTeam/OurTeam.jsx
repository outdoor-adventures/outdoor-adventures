import axios from 'axios';
import Nav from '../Nav/Nav';
import './OurTeam.css';

const OurTeam = () => {
    return ( 
        <>
            <Nav pageTitle="Meet the Team" />
            <div className="team-container">
                <div className="team-content">
                    <div className="two-column-section">
                        <section>
                            <h2>Charlotte Ganske</h2>
                            <img className="dev-image" src="" alt="Charlotte Ganske" />
                            <h3>Full-Stack Developer</h3>
                            <p>
                                Hello, I'm Charlotte! When im not coding, you can find me Skiing, relaxing with my three cats, or hiking to my favorite swimming hole!
                            </p>
                        </section>

                        <section>
                            <h2>Johnny De Luna</h2>
                            <img className="dev-image" src="" alt="Johnny De Luna" />
                            <h3>Full-Stack Developer</h3>
                            <p>
                                Hey there! I'm Johnny, When I'm not coding, you can find me eating some good thai food, at the skate park, or hanging out with my friends!
                            </p>
                        </section>
                    </div>
                </div>
            </div>
         </>
    )
}
export default OurTeam;
