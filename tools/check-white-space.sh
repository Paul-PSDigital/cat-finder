RESULT=`pcregrep -r -H -n -M '^\s*\n^\s*\n' config models modules shared | grep -v -e '^\s*$' | sed 's/^/ERROR: Multiple blank lines found: /'`
if [ "$RESULT" ]; then
  echo "$RESULT"
  exit 1
else
  exit 0
fi
