# composes is an extension CSS modules adds, so ignore that
# TODO vendor prefixes are currently ignored but when we implement autoprefixer shouldn't be
RESULT=`scss-lint -c .scss-lint.yml | grep -v "Unknown property composes" | grep -v "Avoid vendor prefixes"`
if [ "$RESULT" ]; then
  echo ${RESULT}
  exit 1
else
  exit 0
fi
