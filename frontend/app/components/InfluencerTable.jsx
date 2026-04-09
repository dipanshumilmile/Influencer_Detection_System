export default function InfluencerTable({ data }) {
  return (
    <table  className="bg-gray-800 p-4 rounded-xl border border-gray-700" border="1" cellPadding="10" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>User</th>
          <th>Score</th>
          <th>PageRank</th>
          <th>InDegree</th>
          {/* <th>Betweenness</th> */}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td>{item.user}</td>
            <td>{item.score.toFixed(4)}</td>
            <td>{item.pagerank.toFixed(4)}</td>
            <td>{item.indegree.toFixed(4)}</td>
            {/* <td>{item.betweenness.toFixed(4)}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}