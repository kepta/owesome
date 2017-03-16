const xml1 = `
<?xml version='1.0' encoding='UTF-8'?>
<osmChange version="0.6" generator="Osmosis 0.43.1">
  <modify>
    <node id="125743954" version="4" timestamp="2017-03-10T03:10:47Z" uid="135163" user="MikeN" changeset="46727355" lat="33.641273" lon="-90.2084768">
      <tag k="railway" v="level_crossing"/>
    </node>
    <node id="125864749" version="5" timestamp="2017-03-10T03:10:47Z" uid="135163" user="MikeN" changeset="46727355" lat="33.6412765" lon="-90.2084274">
      <tag k="railway" v="level_crossing"/>
    </node>
    <node id="178769176" version="5" timestamp="2017-03-10T03:10:44Z" uid="4957561" user="tlt83" changeset="46727353" lat="38.8626885" lon="-75.332906"/>
    <node id="178769538" version="6" timestamp="2017-03-10T03:10:44Z" uid="4957561" user="tlt83" changeset="46727353" lat="38.8628304" lon="-75.3327115"/>
    <node id="178781811" version="4" timestamp="2017-03-10T03:10:44Z" uid="4957561" user="tlt83" changeset="46727353" lat="38.8625469" lon="-75.332971"/>
    <node id="2045597088" version="2" timestamp="2017-03-10T03:10:35Z" uid="3315483" user="8dirfriend" changeset="46727352" lat="33.1400207" lon="132.5181804"/>
  </modify>
  <delete>
    <node id="2045597090" version="2" timestamp="2017-03-10T03:10:36Z" uid="3315483" user="8dirfriend" changeset="46727352" lat="33.139877" lon="132.518336"/>
  </delete>
  <modify>
    <node id="2045597096" version="2" timestamp="2017-03-10T03:10:35Z" uid="3315483" user="8dirfriend" changeset="46727352" lat="33.139937" lon="132.51792"/>
  </modify>
  <delete>
    <node id="2045597107" version="2" timestamp="2017-03-10T03:10:36Z" uid="3315483" user="8dirfriend" changeset="46727352" lat="33.139937" lon="132.51792"/>
  </delete>
  <modify>
    <way id="17246497" version="6" timestamp="2017-03-10T03:10:44Z" uid="4957561" user="tlt83" changeset="46727353">
      <nd ref="178781033"/>
      <nd ref="178781810"/>
      <nd ref="4727047424"/>
      <nd ref="178781811"/>
      <nd ref="178769176"/>
      <nd ref="178769538"/>
      <tag k="highway" v="tertiary"/>
      <tag k="name" v="Daniels Road"/>
      <tag k="name_1" v="Road 215A"/>
      <tag k="ref" v="(215A)"/>
      <tag k="tiger:cfcc" v="A41"/>
      <tag k="tiger:county" v="Sussex, DE"/>
      <tag k="tiger:name_base" v="Daniels"/>
      <tag k="tiger:name_base_1" v="Road 215A"/>
      <tag k="tiger:name_type" v="Rd"/>
      <tag k="tiger:reviewed" v="no"/>
      <tag k="tiger:zip_left" v="19960"/>
      <tag k="tiger:zip_left_1" v="19960"/>
      <tag k="tiger:zip_left_2" v="19960"/>
    </way>
    <way id="194050399" version="3" timestamp="2017-03-10T03:10:35Z" uid="3315483" user="8dirfriend" changeset="46727352">
      <nd ref="2045596705"/>
      <nd ref="2045596720"/>
      <nd ref="2045596736"/>
      <nd ref="2045596778"/>
      <nd ref="2045596793"/>
      <nd ref="2045596806"/>
      <nd ref="2045596809"/>
      <nd ref="2045596844"/>
      <nd ref="2045596855"/>
      <nd ref="4381749513"/>
      <nd ref="2045596871"/>
      <nd ref="2045596880"/>
      <nd ref="2045596925"/>
      <nd ref="4381749512"/>
      <nd ref="2045596959"/>
      <nd ref="2045596970"/>
      <nd ref="2045596978"/>
      <nd ref="2045596980"/>
      <nd ref="2045596989"/>
      <nd ref="2045596996"/>
      <nd ref="2045597023"/>
      <nd ref="2045597080"/>
      <nd ref="2045597088"/>
      <tag k="highway" v="residential"/>
      <tag k="source" v="YahooJapan/ALPSMAP"/>
    </way>
    </modify>
    <create>
    <relation id="7058581" version="1" timestamp="2017-03-10T03:10:34Z" uid="3315483" user="8dirfriend" changeset="46727352">
      <member type="way" ref="334360947" role="from"/>
      <member type="node" ref="4727047492" role="via"/>
      <member type="way" ref="479633945" role="to"/>
      <tag k="restriction" v="no_right_turn"/>
      <tag k="type" v="restriction"/>
    </relation>
    <relation id="7058582" version="1" timestamp="2017-03-10T03:10:59Z" uid="4153060" user="sinclarius" changeset="46727354">
      <member type="way" ref="479634046" role="inner"/>
      <member type="way" ref="479634047" role="outer"/>
      <tag k="building" v="yes"/>
      <tag k="type" v="multipolygon"/>
    </relation>
  </create>
</osmChange>
`;

it('filters the users ', () => {
    expect(typeof xml1).toEqual('string');
});
module.exports = xml1;