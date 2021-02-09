# Replaces paths in redis config with the current and starts redis server.
# Not the best solution but it works.
DOT_R=".reventlou_dev" #damn this is painful. Just look at the sed
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Server dir: $DIR"
rm -f $HOME/$DOT_R/db/redis.tmp.conf  #still bound to $DOT_R. Move that to ts and solve #32
RS_PATH="$DIR/modules"
#mkdir -p $HOME/$DOT_R/db
sed -e "s|MY_HOME|$HOME|g; s|RS_PATH|$RS_PATH|g; s|DOT_REVENTLOU|$DOT_R|g" $HOME/$DOT_R/db/redis.conf >> $HOME/$DOT_R/db/redis.tmp.conf
$DIR/redis-server $HOME/$DOT_R/db/redis.tmp.conf
