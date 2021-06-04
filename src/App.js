import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { db, auth } from "./components/firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in..
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out..
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup action
      unsubscribe();
    };
  }, [user, username]);
  //UseEffect --> it runs a piece of code based on the condition provided

  useEffect(() => {
    // this is where code runs
    db.collection("posts")
      .orderBy("timestamp", "desc") //recent upload order
      .onSnapshot((snapshot) => {
        // every single a new post is added run this code
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);
  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
  };
  const signin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup">
              <center>
                <h1 className="app__heading">
                  Pro<span>~</span>grammer
                </h1>

                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="Button" type="submit" onClick={signup}>
                  Sign up
                </Button>
              </center>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup">
              <center>
                <h1 className="app__heading">
                  Pro<span>~</span>grammer
                </h1>

                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signin}>
                  Sign In
                </Button>
              </center>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div className="app__signup">
            <h1 className="app__heading">
              Pro<span>~</span>grammer
            </h1>
            {user?.displayName ? (
              <ImageUpload username={user.displayName} />
            ) : (
              <h3>You need to login</h3>
            )}
          </div>
        </div>
      </Modal>
      {/* header */}
      <div className="app__header">
        <h1 className="app__heading">
          Pro<span>~</span>grammer
        </h1>

        {user ? (
          <div className="app__logoutcontainer">
            <Button class="app__upload" onClick={() => setOpenUpload(true)}>
              <i class="fas fa-cloud-upload-alt"></i>
            </Button>
            <Button class="btn" onClick={() => auth.signOut()}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button class="app__upload" onClick={() => setOpenUpload(true)}>
              <i class="fas fa-cloud-upload-alt"></i>
            </Button>
            <Button class="btn" onClick={() => setOpenSignIn(true)}>
              Sign In
            </Button>

            <Button class="btn" onClick={() => setOpen(true)}>
              Sign up
            </Button>
          </div>
        )}
      </div>
      <div className="app__posts ">
        {posts.map(({ post, id }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imgUrl={post.imgUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
