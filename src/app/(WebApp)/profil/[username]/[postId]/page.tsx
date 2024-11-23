export default function Page({ params }: { params: { username: string; postId: string } }) {
  const { username, postId } = params;
  return (
    <div>
      <p>Post id : {postId}</p>
      <p>Username : {username}</p>
    </div>
  );
}
