class BildeTest extends Component {
  render() {
    return (
      <div>
        <input id="kom" type="number" value="123" />
        <input id="kat" type="number" value="1" />
        <input id="ov" type="text" value="overskrift" />
        <input id="be" type="text" value="beskrivelse" />
        <input id="bi" type="text" value="bilde" />
        <input id="lat" type="number" value="1" />
        <input id="lng" type="number" value="1" />
        <input id="ph" type="file" multiple />
        <button onClick={send}>Send</button>
      </div>
    );
  }
  send() {}
}
export let bildeTest = new BildeTest();
