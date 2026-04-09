export default function Error({ message }) {
  return (
    <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
      <h3>Error: {message}</h3>
    </div>
  );
}