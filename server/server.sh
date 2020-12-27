# Replaces paths in redis config with the current and starts redis server.
# Not the best solution but it works.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Server dir: $DIR"
rm -f $HOME/.reventlou/db/redis.tmp.conf
RS_PATH="$DIR/modules"
#mkdir -p $HOME/.reventlou/db
sed -e "s|MY_HOME|$HOME|g; s|RS_PATH|$RS_PATH|g" $HOME/.reventlou/db/redis.conf >> $HOME/.reventlou/db/redis.tmp.conf
$DIR/redis-server $HOME/.reventlou/db/redis.tmp.conf


