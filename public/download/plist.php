<?php

$plist = $_GET['plist'] . '.plist';

header('content-type: application/xml');
header('Content-Disposition: attachment; filename='.basename($plist));
header('Content-Transfer-Encoding: binary');

$content = file_get_contents($plist);
echo $content;
