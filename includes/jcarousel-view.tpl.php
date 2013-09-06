<?php

/**
 * @file jcarousel-view.tpl.php
 * View template to display a list as a carousel.
 */
?>

 <div class="jcarousel-wrapper">
  <div class="<?php print $jcarousel_classes; ?>">
    <ul>
      <?php foreach ($rows as $id => $row): ?>
        <li class="<?php print $row_classes[$id]; ?>"><?php print $row; ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <a class="jcarousel-prev" href="#">Prev</a>
  <a class="jcarousel-next" href="#">Next</a>
</div>
