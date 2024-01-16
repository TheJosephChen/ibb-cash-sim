import './App.css';
import React, {useState}from 'react';
import CalculateInterest from './interest';
import convertNumberLetter from "./numbers/NumberConversions";

function App() {
  const [levels, setLevels] = useState();
  const [skips, setSkips] = useState();
  const [worldValue, setWorldValue] = useState();
  const [brickCash, setBrickCash] = useState();
  const [stageBonusCash, setStageBonusCash] = useState();
  const [interestCash, setInterestCash] = useState();

  const handleSubmit = (e) => {
    
    e.preventDefault();

    const [levels, totalStagesSkipped, totalCashOnHand, totalCashFromBricks, totalCashFromStageBonus, totalCashFromInterest] = CalculateInterest(e);
    setLevels(levels);
    setSkips(totalStagesSkipped);
    setWorldValue(totalCashOnHand);
    setBrickCash(totalCashFromBricks);
    setStageBonusCash(totalCashFromStageBonus);
    setInterestCash(totalCashFromInterest);

  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h2>Cash Bonuses</h2>
        <div className="form-row">
          <div className="col">
            <label>
              Total Brick Cash Bonus:
              <input
                id="brickCashMulti"
                type="decimal" />
            </label>
          </div>
          <div className="col">
            <label>
              Total Cash Brick Bonus:
              <input
                id="cashBrickMulti"
                type="decimal" />
            </label>
          </div>
          <div className="col">
            <label>
              Total Cash Brick Chance:
              <input
                id="cashBrickChanceValue"
                type="decimal" />
            </label>
          </div>
          <div className="col">
            <label>
              Total Stage Complete Bonus:
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
              Levels Completed
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
              Interest card level
              <input
                id="interestLevel"
                type="number" />
            </label>
          </div>
          <div className="col">
            <label>
              Bomb Brick card level
              <input
                id="bombLevel"
                type="number" />
            </label>
          </div>
        </div>
        <h2>Calculate</h2>
        <button type="submit">Do the thing</button>
      </form>

      <table style={{ width: 500 }}>
        <thead>
          <tr>
            <th>Levels Run</th>
            <th>Levels Skipped</th>
            <th>Final World Value</th>
            <th>Brick Cash Earned</th>
            <th>Stage Bonus Cash Earned</th>
            <th>Interest Earned</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{levels}</td>
            <td>{skips}</td>
            <td>{convertNumberLetter(worldValue)}</td>
            <td>{convertNumberLetter(brickCash)}</td>
            <td>{convertNumberLetter(stageBonusCash)}</td>
            <td>{convertNumberLetter(interestCash)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
