import './App.css';
import React, { useState } from 'react';
import CalculateInterest from './interest';
import convertNumberLetter from "./numbers/NumberConversions";

function App() {
  const [levels, setLevels] = useState();
  const [skips, setSkips] = useState();
  const [cardBadgeSkips, setCardBadgeSkips] = useState();
  const [levelsWarped, setLevelsWarped] = useState();
  const [worldValue, setWorldValue] = useState();
  const [brickCash, setBrickCash] = useState();
  const [stageBonusCash, setStageBonusCash] = useState();
  const [interestCash, setInterestCash] = useState();
  const [interestCap, setInterestCap] = useState("N/A");
  const pink = "#ff9dbc"
  const yellow = "#fff889"

  const handleSubmit = (e) => {

    e.preventDefault();

    const [levels, totalStagesSkipped, totalLevelsSkipped, totalLevelsWarped, totalCashOnHand, totalCashFromBricks, totalCashFromStageBonus, totalCashFromInterest, interestCapLevel] = CalculateInterest(e);
    setLevels(levels);
    setSkips(totalStagesSkipped);
    setCardBadgeSkips(totalLevelsSkipped);
    setLevelsWarped(totalLevelsWarped);
    setWorldValue(totalCashOnHand);
    setBrickCash(totalCashFromBricks);
    setStageBonusCash(totalCashFromStageBonus);
    setInterestCash(totalCashFromInterest);
    setInterestCap(interestCapLevel);

  }

  return (
    <div className="App">
      <div className="calc-container">
        <form onSubmit={handleSubmit}>
          <h2>Cash Bonuses</h2>
          <div className="form-row">
            <div className="col">
              <label>
                Total Brick Cash Bonus (calculated from cards, badges, and masteries):
                <input
                  id="brickCashMulti"
                  type="decimal" />
              </label>
            </div>
            <div className="col">
              <label>
                Total Cash Brick Bonus (from stats page):
                <input
                  id="cashBrickMulti"
                  type="decimal" />
              </label>
            </div>
            <div className="col">
              <label>
                Total Cash Brick Chance (from stats page):
                <input
                  id="cashBrickChanceValue"
                  type="decimal" />
              </label>
            </div>
            <div className="col">
              <label>
                Total Stage Complete Bonus (from stats page):
                <input
                  id="stageBonusMulti"
                  type="decimal" />
              </label>
            </div>
            <div className="col">
              <label>
                All Cash Bonus:
                <input
                  id="allCashMulti"
                  type="decimal" />
              </label>
            </div>
          </div>

          <h2>Level Progression</h2>
          <div className="form-row">
            <div className="col">
              <label>
                Levels Completed:
                <input
                  id="levels"
                  type="number" />
              </label>
            </div>
            <div className="col">
              <label>
                Total Stage Skip percentage:
                <input
                  id="stageSkipPercent"
                  type="number" />
              </label>
            </div>
            <div className="col">
              <label>
                Stages Warped per Black Hole:
                <input
                  id="blackHoleStages"
                  type="number" />
              </label>
            </div>
          </div>

          <h2>Cards</h2>
          <div className="form-row">
            <div className="col">
              <label>
                Interest card level:
                <input
                  id="interestLevel"
                  type="number" />
              </label>
            </div>
            <div className="col">
              <label>
                Bomb Brick card level:
                <input
                  id="bombLevel"
                  type="number" />
              </label>
            </div>
            <div className="col">
              <label>
                Stage Skip card mastery level:
                <input
                  id="stageSkipLevel"
                  type="number" />
              </label>
            </div>
            * Masteries are additional bonuses that you can unlock for your cards once they reach level 6.
          </div>
          <h2>Calculate</h2>
          <button type="submit">Do the thing</button>
        </form>

        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>Levels Completed</th>
              <th style={{background: pink}}>Total Levels Skipped</th>
              <th style={{background: pink}}>Card/Badge Skips</th>
              <th style={{background: pink}}>Levels Warped</th>
              <th>Interest Cap Level*</th>
              <th style={{background: yellow}}>Final World Value</th>
              <th style={{background: yellow}}>Brick Cash Earned</th>
              <th style={{background: yellow}}>Stage Bonus Cash Earned</th>
              <th style={{background: yellow}}>Interest Earned</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{levels}</td>
              <td style={{background: pink}}>{skips}</td>
              <td style={{background: pink}}>{cardBadgeSkips}</td>
              <td style={{background: pink}}>{levelsWarped}</td>
              <td>{interestCap}</td>
              <td style={{background: yellow}}>{convertNumberLetter(worldValue)}</td>
              <td style={{background: yellow}}>{convertNumberLetter(brickCash)}</td>
              <td style={{background: yellow}}>{convertNumberLetter(stageBonusCash)}</td>
              <td style={{background: yellow}}>{convertNumberLetter(interestCash)}</td>
            </tr>
          </tbody>
        </table>
        * Interest Cap Level is the first level at which the interest you earn is based on your stage bonus instead of your total unspent cash. If it shows "N/A", that means you have not entered a high enough Levels Completed to hit your interest cap.
      </div>
    </div>
  );
}

export default App;
